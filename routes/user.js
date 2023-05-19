const userController = require('../controller/user')

const express = require('express')

const router = express.Router();

router.get('/signup',userController.getSignupPage);

router.post('/signup',userController.postSignupPage)

module.exports = router