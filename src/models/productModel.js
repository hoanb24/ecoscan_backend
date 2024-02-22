const mongoose = require('mongoose')
const {ShopModel} = require('./shopModel')

const productSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        require: true
    },
    price : {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require:true
    },
    ingredient : {
        type: String,
        require:true
    },
    barcode_number : {
        type:Number,
        require:true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Shop'
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    }
})
const ProductModel = mongoose.model('Products',productSchema)
module.exports = ProductModel