const express = require('express')
const router = express.Router()
const userSchema = require('../../models/CreateUser')

router.get('/',async(req,res,next)=>{

    let users;

    try{

        users = await userSchema.find()

    }catch(err){
        const errors = new HttpError('fetch users failed',421)
        return next(errors)
    }

    res.status(201).json({user:users})
})

module.exports = router