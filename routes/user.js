const userController = require('../controller/user');
const userAuthentication = require('../util/auth');

const express = require('express')

const router = express.Router();

router.get('/signup',userController.getSignupPage);

router.post('/signup',userController.postSignupPage);

router.get('/login',userController.getLoginPage);

router.post('/login',userController.postLoginPage);

router.post('/checkIfAdmin',userAuthentication.authenticate,userController.checkIfAdmin)

module.exports = router