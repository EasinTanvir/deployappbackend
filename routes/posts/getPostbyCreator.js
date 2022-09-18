const express = require('express')
const router = express.Router()
const postSchema = require('../../models/CreatePost')
const HttpError = require('../../helper/Error/HttpError')

router.get('/:id',async(req,res,next)=>{
    const params = req.params.id;

    let getPostbyCreator ;
    try{

        getPostbyCreator = await postSchema.find({creator:params})
    }catch(err){
        const errors = new HttpError('get post by creator failed')
        return next(errors)
    }

    res.status(201).json({postbycreator:getPostbyCreator})

})

module.exports = router