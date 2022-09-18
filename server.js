const  express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const HttpError = require('./helper/Error/HttpError')
const fs = require('fs')
const path = require('path')
const signUp = require('./routes/users/signUp')
const signIn = require('./routes/users/signIn')
const allUsers = require('./routes/users/allUsers')
const createPost = require('./routes/posts/createPost')
const singlePost = require('./routes/posts/singlePost')
const updatePost = require('./routes/posts/editPost')
const getPostbyCreator = require('./routes/posts/getPostbyCreator')
const deletePost = require('./routes/posts/deletePost')
const allposts = require('./routes/posts/allpost')
const singleUser = require('./routes/users/singleUser')
const updatePassword = require('./routes/users/updatePass')

app.use(express.json())
dotenv.config()
app.use('/uploads',express.static(path.join('uploads')))

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection;
db.once('error',(err)=>{console.error(err)})
db.on('open',()=>console.log('database connected'))

app.use('/api/signup',signUp)
app.use('/api/signin',signIn)
app.use('/api/allusers',allUsers)
app.use('/api/createpost',createPost)
app.use('/api/singlepost',singlePost)
app.use('/api/updatepost',updatePost)
app.use('/api/getpostbycreator',getPostbyCreator)
app.use('/api/deletepost',deletePost)
app.use('/api/allpost',allposts)
app.use('/api/singleuser',singleUser)
app.use('/api/updatepass',updatePassword)




app.use((req,res,next)=>{

    const errors = new HttpError('no routes found',500)
    return next(errors)

})



app.use((error,req,res,next)=>{

if(req.file){
    fs.unlink(req.file.path,err=>{
        console.log(err)
    })
}

    if(res.headerSent){
       return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'an unknown error occured'})
})

app.listen(5000,()=>{
    console.log('server running')
})