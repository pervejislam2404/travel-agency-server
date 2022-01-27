const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 4000;


// all-schema
const userModel = require('./schema/userSchema')
const blogModel = require('./schema/blogSchema')


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


//posting a blog

app.post('/addBlog',(req, res) => {
    const {title,price,location,name,email,category,img,description,date}= req.body
    const newBlog = new blogModel({
        title,
        email,
        name,
        price,
        photo: img,
        location,
        category,
        description,
        date,
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




app.listen(port, () => {
    console.log('server running on port ' + port);
});