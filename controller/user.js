const fs = require('fs')
const path = require('path')

const User = require('../model/user')

const sequelize = require('../util/database')

const bcrypt = require('bcrypt')


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