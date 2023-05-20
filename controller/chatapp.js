const path = require('path');
const fs = require('fs');

exports.getMainPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','chatApp.html'))
}