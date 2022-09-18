const mongoose = require('mongoose');

const CreateUser = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minLength:6},
    image:{type:String,required:true},
    places:[{type:mongoose.Types.ObjectId,required:true,ref:'posts'}]   
})

CreateUser.set('toJSON',{getters:true})

module.exports = mongoose.model('users',CreateUser)