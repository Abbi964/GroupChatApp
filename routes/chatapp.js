const chatappController = require('../controller/chatapp')
const userAuthentication = require('../util/auth')

const multer = require('multer')  // to handle uploaded files
// Multer configuration
const upload = multer({ dest: 'uploads/' });

const express = require('express');
const router = express.Router();


router.get('/main',chatappController.getMainPage);

router.post('/sendMsg',userAuthentication.authenticate,chatappController.sendMsg);

router.get('/getNewMsg',chatappController.getNewMsg);

router.post('/upload',userAuthentication.authenticate,upload.single('file'),chatappController.upload)

module.exports = router