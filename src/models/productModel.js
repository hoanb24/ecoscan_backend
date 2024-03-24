const mongoose = require('mongoose')
const {ShopModel} = require('./shopModel')

const productSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        require: true
    },
    image: [{
        url: {
            type: String,
            required: true
        }
    }],
    ingredient : {
        type: String,
        require:true
    },
    barcode_number : {
        type:Number,
        require:true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    }
})
const ProductModel = mongoose.model('Products',productSchema)
module.exports = ProductModel