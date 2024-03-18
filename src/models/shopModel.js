const mongoose = require('mongoose')
const Decimal = require('decimal.js')

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
        type:Decimal,
        require:true
    },
    latitude : {
        type:Decimal,
        require:true
    }
})


const ShopModel = mongoose.model('Shop',shopSchema)
module.exports = ShopModel