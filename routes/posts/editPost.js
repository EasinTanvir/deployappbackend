const express = require('express')
const router = express.Router()
const postSchema = require('../../models/CreatePost')
const HttpError = require('../../helper/Error/HttpError')
const protectAuth = require('../../helper/Auth/AuthProtect')

router.use(protectAuth)

router.patch('/:id',async(req,res,next)=>{

    const {title,description} = req.body;

    const params = req.params.id;

    let singlePost

    try{
        singlePost = await postSchema.findById(params)
        
    }catch(err){
        const errors = new HttpError('fetch single post failed')
        return next(errors)
    }

    //extra security
    if(singlePost.creator.toString() !==req.userData.userId){
        const errors = new HttpError('you are not allow to update that post')
        return next(errors)
    }

    if(title != null && description !=null){

    singlePost.title = title;
    singlePost.description = description
    }

    let updatePost;
    try{
        updatePost = await singlePost.save()

    }catch(err){
        const errors = new HttpError('post update failed')
        return next(errors)
    }

    res.status(200).json({post:updatePost})

})

module.exports = router
