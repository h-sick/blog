const path = require('path');

const express = require('express');

const blogController = require('../controllers/blog');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/new', isLoggedIn, blogController.getNewBlog);

router.post('/new', isLoggedIn, blogController.postNewBlog);

router.get('/edit/:id', isLoggedIn, blogController.getEditBlog);

router.post('/edit/:id', isLoggedIn, blogController.postEditBlog);

router.delete('/delete/:id', isLoggedIn, blogController.deleteBlog);

router.get('/themes', blogController.getThemes);

router.get('/user/:id', isLoggedIn, blogController.getUserBlogs);

router.get('/:id', blogController.getBlogDetail);

module.exports = router;
