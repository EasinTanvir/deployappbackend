const express = require('express')
const router = express.Router()
const postSchema = require('../../models/CreatePost')
const HttpError = require('../../helper/Error/HttpError')
const { default: mongoose } = require('mongoose')
const protectAuth = require('../../helper/Auth/AuthProtect')

router.use(protectAuth)

router.delete('/:id',async(req,res,next)=>{

    let deletePost;

    try{
        deletePost = await postSchema.findById(req.params.id).populate('creator')

    }catch(err){
        const errors = new HttpError('fetch post failed to delete')
        return next(errors)
    }

    if(!deletePost){
        const errors = new HttpError('invalid userId to delete that post')
        return next(errors)
    }

    if(deletePost.creator.id !== req.userData.userId){
        const errors = new HttpError('you are not allow to delete that post')
        return next(errors)
    }

    try{
       const sess = await mongoose.startSession()
       sess.startTransaction()
       await deletePost.remove({session:sess})
       deletePost.creator.places.pull(deletePost)
        await deletePost.creator.save({session:sess})
        await sess.commitTransaction()
    }catch(err){
        const errors = new HttpError('delete post failed')
        return next(errors)
    }

    res.status(201).json({message:'post delete successfully'})

})

module.exports = router