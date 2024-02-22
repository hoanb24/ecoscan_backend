const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
    shopName : {
        type: String,
        require: true
    },
    phone :{
        type:Number,
        require:true
    },
    address :{
        type: String,
        require:true
    },
    longitude : {
        type:Number,
        require:true
    },
    latitude : {
        type:Number,
        require:true
    }
})


const ShopModel = mongoose.model('Shop',shopSchema)
module.exports = ShopModel