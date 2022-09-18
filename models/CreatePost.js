const mongoose = require('mongoose');

const CreatePost = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},    
    image:{type:String,required:true},   
    category:{type:String,required:true},   
    creator:{type:mongoose.Types.ObjectId,required:true,ref:'users'},   

})

CreatePost.set('toJSON',{getters:true})

module.exports = mongoose.model('posts',CreatePost)