const express = require('express')
const router = express.Router()
const postSchema = require('../../models/CreatePost')
const HttpError = require('../../helper/Error/HttpError')

router.get('/:id',async(req,res,next)=>{
    const params = req.params.id;

    let fetchPost;

    try{
        fetchPost = await postSchema.findById(params)

    }catch(err){
        const errors = new HttpError('fetch single post failed')
        return next(errors)
    }

    res.status(201).json({post:fetchPost})
})

module.exports = router