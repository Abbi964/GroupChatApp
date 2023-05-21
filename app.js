require('dotenv').config();

const path = require('path')
const fs = require('fs')

const bodyParser = require('body-parser')

const express = require('express')
const app = express();

const sequelize = require('./util/database')

// importing models
const User = require('./model/user');
const Message = require('./model/message');

//adding routes
const userRoutes = require('./routes/user');
const chatappRoutes = require('./routes/chatapp');

// making public folder static
app.use(express.static(path.join(__dirname,'public')))
// adding body parser for json 
app.use(bodyParser.json());


// redirecting '/' to 'user/signup'
app.get('/',(req,res,next)=>{
    res.redirect('/user/signup')
})

// Routing requests
app.use('/user',userRoutes);
app.use('/chatapp',chatappRoutes);

//Defining Relations between models
User.hasMany(Message);
Message.belongsTo(User)


// starting server on port 3000
sequelize.sync()
    .then(()=>{
        app.listen(3000);
    })