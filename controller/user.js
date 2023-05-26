const fs = require('fs')
const path = require('path')

const User = require('../model/user');
const GroupUser = require('../model/groupUser');

const sequelize = require('../util/database');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getSignupPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
}

exports.postSignupPage = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const phoneNo = req.body.phoneNo;
        // hashing the password
        bcrypt.hash(password,10, async(err,hash)=>{
            // finding or creating a user
            const [user,created] = await User.findOrCreate({
                where: {email : email},
                defaults : {
                    name : username,
                    email : email,
                    password : hash,
                    phone : phoneNo,
                },
                transaction : t
            })
            await t.commit();
            res.json(created) 
        })

    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}


exports.getLoginPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.postLoginPage = async(req,res,next)=>{
    let t = await sequelize.transaction()
    try{
        const email = req.body.email;
        const password = req.body.password;
        // finding user with given email
        let user = await User.findOne({
            where : {email : email},
            transaction : t
        })
        await t.commit()
        // checking if user exists
        if(user === null){
            res.json({msg : 'User not found', success : false})
        }
        else{
            // checking if password matches
            bcrypt.compare(password,user.password,(err,same)=>{
                if(err){
                    console.log(err);
                    res.json({msg : "Internal server error", success : false})
                }
                else if(same){
                    res.status(201).json({msg : 'Log in Sucessful', token : generateJWT(user),username : user.name ,email : user.email, success : true})
                }
                else{
                    res.json({msg : 'User not authorized', success : false})
                }
            })
        }
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.checkIfAdmin = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        let user = req.user;
        let groupId = req.body.groupId;
        // checking if user is admin of group
            // first finding in GroupUser
        let response = await GroupUser.findOne({
            where : {
                [Op.and] : [
                    {userId : user.id},
                    {groupId : groupId}
                ]
            },transaction : t
        })
        await t.commit()
        // checking if admin or not
        if(response.isAdmin){
            res.json({success : true})
        }
        else{
            res.json({success : false,msg : 'You are not Admin'})
        }
    }
    catch(err){
        console.log(err);
        await t.rollback();
        res.json({success : false, msg : "Something Went Wrong"})
    }
    
}

function generateJWT (user){
    return jwt.sign({userId : user.id},process.env.JWT_KEY)
}