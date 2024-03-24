const mongoose = require('mongoose')

const productRecycleSchema = new mongoose.Schema({
    steps : [{
        step : {
            type: String,
            require:true
        }
    }],
    image : [{
        url : {
            type: String,
            require:true
        }
    }],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }
})

const productRecycleModel = mongoose.model('ProductRecycle',productRecycleSchema)
module.exports = productRecycleModel