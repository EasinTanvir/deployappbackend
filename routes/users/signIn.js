const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = require('../../models/CreateUser')
const HttpError = require('../../helper/Error/HttpError')

router.post('/',async(req,res,next)=>{

    const {email,password} = req.body;

    let findUser;
    try{

        findUser = await userSchema.findOne({email:email})
    }catch(err){
        const errors = new HttpError('cannot find any user',421)
        return next(errors)
    }
    if(!findUser){
        const errors = new HttpError('Sorry no user found',421)
        return next(errors)
    }

  let checkPass

  try{
     checkPass = await bcrypt.compare(password,findUser.password)
  }catch(err){
    const errors = new HttpError('Sorry invalid password',500)
    return next(errors)
  }

  if(!checkPass){
    const errors = new HttpError('Sorry invalid password',500)
    return next(errors)
  }

  let token;

  try{

    token = jwt.sign({userId:findUser.id,email:findUser.email},'secret_key',{expiresIn:'1h'})
  }catch(err){
    const errors = new HttpError('signin failed in token',500)
    return next(errors)
  }


  res.status(201).json({userId:findUser.id,email:findUser.email,token:token})


})

module.exports = router