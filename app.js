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
const Group = require('./model/group');
const GroupUser = require('./model/groupUser');

//adding routes
const userRoutes = require('./routes/user');
const chatappRoutes = require('./routes/chatapp');
const groupRoutes = require('./routes/group');

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
app.use('/group',groupRoutes);

//Defining Relations between models
User.hasMany(Message);
Message.belongsTo(User)

User.belongsToMany(Group,{through : GroupUser,foreignKey : "userId"});
Group.belongsToMany(User,{through : GroupUser, foreignKey : 'groupId'});

Group.hasMany(Message);
Message.belongsTo(Group);


// starting server on port 3000
sequelize.sync()
// sequelize.sync({force : true})
    .then(()=>{
        app.listen(3000);
    })