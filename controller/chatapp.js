const path = require('path');
const fs = require('fs');

const User = require('../model/user');
const Message = require('../model/message');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const { json } = require('body-parser');
const s3Service = require('../services/s3')

exports.getMainPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','chatApp.html'))
}

exports.sendMsg = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const msg = req.body.msg;
        const groupId = req.body.groupId
        const user = req.user
        // creating a new message
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

exports.upload = async(req,res,next)=>{
    try{
        const user = req.user;
        // const groupId = req.body.groupId
        const uploadedFile = req.file   // this is due to use of 'multer'
        // due to multer, file recieved is in original form and not a raw file data
        let filename = `IMG-${uploadedFile.originalname} - ${user.id}.jpg`
        let fileurl = await s3Service.uploadToS3(uploadedFile,filename)
        if(fileurl){
            // sending fileurl back to frontend
            res.json({fileurl : fileurl,filename : filename, success : true})
        }
        else{
            res.json({msg : "something went wrong",success : false})
        }
    }
    catch(err){
        console.log(err);
        res.json({msg : 'Something went wrong', success : false});
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
