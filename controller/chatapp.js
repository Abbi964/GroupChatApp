const path = require('path');
const fs = require('fs');

const User = require('../model/user');
const Message = require('../model/message');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const { json } = require('body-parser');

exports.getMainPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','chatApp.html'))
}

exports.sendMsg = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const msg = req.body.msg;
        const groupId = req.body.groupId
        const user = req.user
        // creating a new nessage
        await Message.create({
            message : msg,
            userId : user.id,
            username : user.name,
            groupId : groupId,
        },
        {
            transaction : t,
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


exports.getNewMsg = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        // getting all the new messages from DB
        // let newMsgArray = await Message.findAll({
        //     offset : +req.query.lastMsgId,
        //     transaction : t
        // });
        let newMsgArray = await Message.findAll({
            where : {
                id : {
                    [Op.gt] : +req.query.lastMsgId
                },
                groupId : req.query.groupId,
            },
            transaction : t
        })
        await t.commit()
        res.json({newMsgArray : newMsgArray, success : true})
    }
    catch(err){
        console.log(err);
        await t.rollback()
        res.json({msg : 'something went wrong', success : false})
    }
}
