const fs = require('fs')
const path = require('path')

const User = require('../model/user')

const sequelize = require('../util/database')

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
            res.status(404).json({msg : 'User not found', success : false})
        }
        else{
            // checking if password matches
            bcrypt.compare(password,user.password,(err,same)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({msg : "Internal server error", success : false})
                }
                else if(same){
                    res.status(201).json({msg : 'Log in Sucessful', token : generateJWT(user.id), success : true})
                }
                else{
                    res.status(401).json({msg : 'User not authorized', success : false})
                }
            })
        }
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

function generateJWT (id){
    return jwt.sign({userId : id},process.env.JWT_KEY)
}