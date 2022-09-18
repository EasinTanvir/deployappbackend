const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check } = require('express-validator');
const { validationResult} = require('express-validator');
const userSchema = require('../../models/CreateUser')
const HttpError = require('../../helper/Error/HttpError')
const fileUpload = require('../../helper/FileUpload/FileUpload')

router.post('/',fileUpload.single('image') ,[
    check('username')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
    check('image').isEmpty()
  ],async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('password must be six character', 422)
      );
    }

    

    const {username,email,password} = req.body

    let existingUsers;

    try{
        existingUsers = await userSchema.findOne({email:email})

    }catch(err){
        const errors = new HttpError('Sorry email already taken',421)
        return next(errors)
    }

    if(existingUsers){
        const errors = new HttpError('Sorry email already taken',421)
        return next(errors)
    }

 

    let hashPass;
    try{
       

            hashPass = await bcrypt.hash(password,12)
      

    }catch(err){
        const errors = new HttpError('password hased failed',421)
        return next(errors)
    }



    const createUser = new userSchema({
        username,
        email,
        password:hashPass,
        image:req.file.path,
        places:[]

    })

    let users;
    try{

        users = await createUser.save()

    }catch(err){
        const errors = new HttpError('Create user failed ',500)
        return next(errors)
    }

    let token;
    try{

     token = jwt.sign({userId:createUser.id,email:createUser.email},'secret_key',{expiresIn:'1h'})
    }catch(err){
      const errors = new HttpError('Create user failed in token',500)
      return next(errors)
    }


    res.status(201).json({userId:createUser.id,email:createUser.email,token:token})

})

module.exports = router