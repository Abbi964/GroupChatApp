const path = require('path');
const fs = require('fs');

const User = require('../model/user');
const Message = require('../model/message');
const sequelize = require('../util/database');
const { json } = require('body-parser');

exports.getMainPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','chatApp.html'))
}

exports.sendMsg = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const msg = req.body.msg;
        const user = req.user
        // creating a new nessage
        await Message.create({
            message : msg,
            userId : user.id,
        })
        await t.commit()
        res.json({msg : 'message Sent', success : true})

    }
    catch(err){
        await t.rollback()
        console.log(err)
        res.json({msg : 'Something went Wrong', success : false})
    }
}