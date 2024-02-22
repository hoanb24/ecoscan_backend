const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name : {
        type: String,
        require:true
    },
    origin: {
        type:String,
        require: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
})

const subCategoryModel = mongoose.model('SubCategory',subCategorySchema)
module.exports = subCategoryModel