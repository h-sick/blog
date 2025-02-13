const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post(
  '/login',
  body('email').isEmail().withMessage('Please enter a valid email address'),
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  body('email').isEmail().withMessage('Please enter a valid email address'),
  authController.postSignup
);

// router.get('/reset', authController.getReset);

// router.post('/reset', authController.postReset);

module.exports = router;
