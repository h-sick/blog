const path = require('path');

const express = require('express');

const blogController = require('../controllers/blog');

const router = express.Router();

router.get('/new', blogController.getNewBlog);

router.post('/new', blogController.postNewBlog);

module.exports = router;
