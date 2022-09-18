const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check } = require('express-validator');
const { validationResult} = require('express-validator');
const userSchema = require('../../models/CreateUser')
const HttpError = require('../../helper/Error/HttpError')

router.patch('/:id',check('newPassword').isLength({ min: 6 }),async(req,res,next)=>{

    const errors = validationResult(req);


    const {oldPassword,newPassword} = req.body;

    let singleUser;

    try{

        singleUser = await userSchema.findById(req.params.id)

    }catch(err){
        const errors = new HttpError('Fetch single user Failed',421)
        return next(errors)
    }

 let checkPass;
 try{
    checkPass = await bcrypt.compare(oldPassword,singleUser.password)

 }catch(err){
    const errors = new HttpError('Sorry your old password is incorrect',421)
    return next(errors)
 }

 if(!checkPass){
    const errors = new HttpError('Sorry your old password is incorrect',421)
    return next(errors)
 }

 if (!errors.isEmpty()) {
    return next(
      new HttpError('Update password must be six character', 422)
    );
  }

 let hashPass;

 try{
    hashPass = await bcrypt.hash(newPassword,12)

 }catch(err){
    const errors = new HttpError('Password hased failed',421)
    return next(errors)
 }

 if(newPassword !=null){
    singleUser.password =hashPass
 }
  
 try{
    await singleUser.save()

 }catch(err){
    const errors = new HttpError('Password update failed',421)
    return next(errors)
 }

 res.status(201).json({user:singleUser})

})

module.exports = router