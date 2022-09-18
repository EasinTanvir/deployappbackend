const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const postSchema = require('../../models/CreatePost')
const userSchema = require('../../models/CreateUser')
const HttpError = require('../../helper/Error/HttpError')
const fileUpload = require('../../helper/FileUpload/FileUpload')
const protectAuth = require('../../helper/Auth/AuthProtect')

router.use(protectAuth)

router.post('/',fileUpload.single('image'),async(req,res,next)=>{
    const {title,description,creator,category} = req.body;
    const createPost = new postSchema({
        title,
        description,
        image:req.file.path,
        category,
        creator
    })

    let users;

    try{
        users = await userSchema.findById(creator)

    }catch(err){
        const errors = new HttpError('to create a post you must authonicated')
        return next(errors)

    }
    

    try{
       const sess = await mongoose.startSession()
       sess.startTransaction()
       await createPost.save({session:sess});
       users.places.push(createPost)
       await users.save({session:sess})
       sess.commitTransaction()

    }catch(err){
        const errors = new HttpError('create user failed')
        return next(errors)
    }

    res.status(201).json({posts:createPost})


})

module.exports = router