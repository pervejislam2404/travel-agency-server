const mongoose = require('mongoose');
require('mongoose-type-url');

const blogSchemaUser = new mongoose.Schema({
    title: String,
    email: String,
    name: String,
    price: String,
    photo: String,
    location: String,
    category: String,
    description: String,
    date: String,
    status: String,
})

const blogModelForUser = mongoose.model('UserBlog', blogSchemaUser);

module.exports = blogModelForUser;