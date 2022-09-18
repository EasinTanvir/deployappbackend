const express = require('express')
const router = express.Router()
const postSchema = require('../../models/CreatePost')

router.get('/',async(req,res,next)=>{

    let posts;

    try{

        posts = await postSchema.find()

    }catch(err){
        const errors = new HttpError('fetch all posts failed')
        return next(errors)
    }

    res.status(201).json({posts:posts})

})

module.exports = router