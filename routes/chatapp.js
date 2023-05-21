const chatappController = require('../controller/chatapp')
const userAuthentication = require('../util/auth')

const express = require('express');
const router = express.Router();

router.get('/main',chatappController.getMainPage);

router.post('/sendMsg',userAuthentication.authenticate,chatappController.sendMsg)

module.exports = router