const jwt = require('jsonwebtoken')

const User = require('../model/user')

exports.authenticate = async(req,res,next)=>{
    try{
        // getting token from authorization
        let token = req.headers.authorization;
        // getting data from token
        let data = tokenToData(token);
        let userId = data.userId
        // finding user by userId
        let user =  await User.findByPk(userId);

        // sending user to next middleware
        req.user = user;
        next()
    }
    catch(err){
        console.log(err)
    }
}

function tokenToData(token){
    return jwt.verify(token,process.env.JWT_KEY)
}

