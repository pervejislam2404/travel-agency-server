const mongoose = require('mongoose');
require('mongoose-type-url');

const blogSchema = new mongoose.Schema({
    title: String,
    email: String,
    name: String,
    price: String,
    photo: String,
    location: String,
    category: String,
    description: String,
    date: String,
    comment: [{ name: String, email: String, comment: String, photo: String }],
    ratting: String,
})

const blogModel = mongoose.model('Blog', blogSchema);

module.exports = blogModel;