const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

const User = require('../models/user');

router.get('/', mainController.getIndex);

module.exports = router;
