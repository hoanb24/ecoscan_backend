const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

const categoryModel = mongoose.model('Category',categorySchema) 
module.exports = categoryModel