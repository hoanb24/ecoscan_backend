const mongoose = require('mongoose')

const productRecycleSchema = new mongoose.Schema({
    instroduce : {
        type: String,
        require: true
    },
    steps : [{
        step : {
            type: String,
            require:true
        }
    }],
    material: [{
        tool : {
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