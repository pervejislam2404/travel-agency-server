const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 4000;


// all-schema
const userModel = require('./schema/userSchema')
const blogModel = require('./schema/blogSchema')
const blogModelForUser = require('./schema/userBlogSchema')


app.use(express.json());
app.use(cors());
dotenv.config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id3ci.mongodb.net/TravelAgency?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, data) => {
    if (error) {
        console.log('error to connect');
    } else {
        console.log('database connect success');
    }
})

// saving-user-to-database
app.post('/saveUser', (req, res) => {
    const { email, displayName } = req.body;
    const user = new userModel({ email, name: displayName })
    user.save((err, data) => {
        if (err) {
            res.json(err)
        } else {
            res.json(data)
        }
    })
})

// saving-user-database-and-update

app.put('/saveUser',(req, res) => {
    const { email, displayName } = req.body;
    userModel.findOneAndUpdate({email:email}, { email, name: displayName }, {upsert: true}, (err, data) => {
        if(err){
            res.json(err)
        }else{
            res.json(data)
        }
    })
})


// checking-admin-status

app.get('/checkAdmin/:email',(req, res) => {
    const email = req.params.email;
    userModel.findOne({email:email},(err, data) => {
        if(err){
            res.json(false)
        }else{
           if(data?.role){
               res.json(true)
           }else{
               res.json(false)
           }
        }
    })
})


// making-admin-to-a-user 

app.put('/makeAdmin/:email',(req, res) => {
    const email = req.params.email;
    userModel.findOneAndUpdate({email:email},{ role:'admin'},{ new: true },(err, data) => {
        if(err){
            res.json(err)
        }else{
            res.json(data)
        }
    })
})


//posting a blog to main blog for admin

app.post('/addBlog',(req, res) => {
    const {title,price,location,name,email,category,photo,description,date,ratting}= req.body
    const newBlog = new blogModel({
        title,
        email,
        name,
        price,
        photo,
        location,
        category,
        description,
        date,
        ratting,
    }) 

    newBlog.save((err, data) => {
        if (err) {
            res.json(err)
        } else {
            res.json(data)
        }
    })
})



//posting a blog to main blog for normal user

app.post('/addBlogForUser',(req, res) => {
    const {title,price,location,name,email,category,photo,description,date,status,ratting}= req.body
    const newBlog = new blogModelForUser({
        title,
        email,
        name,
        price,
        photo,
        location,
        category,
        description,
        date,
        status,
        ratting,
    }) 

    newBlog.save((err, data) => {
        if (err) {
            res.json(err)
        } else {
            res.json(data)
        }
    })
})



// getting-all-blog

app.get('/blogs' ,async(req, res)=>{
    const result = await blogModel.find({});
    res.json(result);
})


// getting-all-normal-user-blog
app.get('/userBlogs' ,async(req, res)=>{
    const result = await blogModelForUser.find({});
    res.json(result);
})


// find-blog-by-id

app.get('/blogDetail/:id', async(req, res)=>{
    const result = await blogModel.find({_id:req.params.id});
    res.json(result)
})



// find-blog-by-email

app.get('/blogDetailByEmail/:email', async(req, res)=>{
    const result = await blogModelForUser.find({email:req.params.email});
    res.json(result)
})


// changing-status

app.put('/changeStatus/:id', async(req, res)=>{
    const id = req.params.id;
    blogModelForUser.findOneAndUpdate({_id:id},{status: 'approved'},{new:true},(err, data)=>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })
})


// delete-blog-from-main-blog

app.delete('/deleteBlog/:id', async(req, res)=>{
    const id = req.params.id;
    blogModel.findOneAndDelete({_id:id},(err, data)=>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })
})


// delete-blog-from-user-collection

app.delete('/deleteUserBlog/:id', async(req, res)=>{
    const id = req.params.id;
    blogModelForUser.findOneAndDelete({_id:id},(err, data)=>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })
})





// add-comment-main-blog 
app.put('/changeComment/:id', async(req, res)=>{
    const com= req.body
    const id = req.params.id;
    blogModel.findOneAndUpdate({_id:id},{comment: com},{new:true},(err, data)=>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })
})





app.listen(port, () => {
    console.log('server running on port ' + port);
});