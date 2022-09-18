const jwt = require('jsonwebtoken')
const HttpError = require('../Error/HttpError')
module.exports = (req,res,next)=>{

    if(req.method==='OPTIONS'){
        return next()
    }

    try{

        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            const errors = new HttpError('token access failed1',401)
            return next(errors)
        }
     const decodeToken =  jwt.verify(token,'secret_key')
     req.userData = {userId:decodeToken.userId}
     next()
    }catch(err){
        const errors = new HttpError('Invalid token',401)
        return next(errors)
    }

  

}


