const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const saltRounds = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

module.exports = {
  getLogin: (req, res, next) => {
    res.render('auth/login', {
      title: 'Login',
    });
  },
  postLogin: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
          title: 'Login',
          errorMessage: errors.array()[0].msg,
          oldInput: { email: req.body.email },
        });
      }

      const { email, password, rememberMe } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(422).render('auth/login', {
          title: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: { email: email },
        });
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(422).render('auth/login', {
          title: 'Login',
          errorMessage:
            'Account is temporarily locked. Please try again later.',
          oldInput: { email: email },
        });
      }

      const doMatch = await bcrypt.compare(password, user.password);

      if (doMatch) {
        // if (!user.isVerified) {
        //   return res.status(422).render('auth/login', {
        //     title: 'Login',
        //     errorMessage: 'Please verify your email first',
        //     oldInput: { email: email }
        //   });
        // }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        req.session.user = user;
        req.session.isLoggedIn = true;

        if (rememberMe === 'on') {
          req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7days
        }

        return req.session.save((err) => {
          if (err) {
            console.log('Session save error:', err);
            return next(err);
          }
          res.redirect('/');
        });
      }

      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }
      await user.save();

      return res.status(422).render('auth/login', {
        title: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: { email: email },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  postLogout: (req, res, next) => {
    // Delete session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return next(err);
      }
      // Delete session cookie
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  },
  getSignup: (req, res, next) => {
    res.render('auth/signup', {
      title: 'Signup',
    });
  },
  postSignup: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
          title: 'Signup',
          errorMessage: errors.array()[0].msg,
          oldInput: req.body,
        });
      }

      const { email, password, name } = req.body;

      // Generate verification token
      // const verificationToken = crypto.randomBytes(32).toString('hex');

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        // verificationToken,
      });

      // Send verification email
      // const verificationUrl = `${req.protocol}://${req.get(
      //   'host'
      // )}/auth/verify/${verificationToken}`;
      // console.log('verificationUrl', verificationUrl);
      // await transporter.sendMail({
      //   to: email,
      //   subject: 'Verify your email',
      //   html: `
      //     <p>Please click this link to verify your email:</p>
      //     <a href="${verificationUrl}">${verificationUrl}</a>
      //   `,
      // });

      // res.render('auth/signup-success', {
      //   title: 'Signup Successful',
      //   message: 'Please check your email to verify your account',
      // });

      res.render('auth/login', {
        title: 'Login',
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          console.log('User already exists');
          return;
        }
        // Hash the password
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => {
            User.create({
              email,
              password: hashedPassword,
            }).then(() => {
              res.redirect('/');
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
