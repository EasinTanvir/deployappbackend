const express = require('express')
const router = express.Router()
const userSchema = require('../../models/CreateUser')

router.get('/:id',async(req,res,next)=>{

    let singleUser;

    try{

        singleUser = await userSchema.findById(req.params.id)

    }catch(err){
        const errors = new HttpError('Fetch single user Failed',421)
        return next(errors)
    }

    res.status(201).json({user:singleUser})

})

module.exports = router