const mongoose = require('mongoose')

const shop_productSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Shops'
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Products'
    },
    expire :{
        type : Date,
        default: Date.now()
    }
})
const shop_productModel = mongoose.model('shop_products',shop_productSchema)
module.exports = shop_productModel 