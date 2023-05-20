const chatappController = require('../controller/chatapp')

const express = require('express');
const router = express.Router();

router.get('/main',chatappController.getMainPage)

module.exports = router