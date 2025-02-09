const path = require('path');

const express = require('express');

const blogController = require('../controllers/blog');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/new', isLoggedIn, blogController.getNewBlog);

router.post('/new', isLoggedIn, blogController.postNewBlog);

router.get('/:id', isLoggedIn, blogController.getUserBlogs);

module.exports = router;
