const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    create_at : {
        type: Date,
        default: Date.now(),
    },
    barcode_number: {
        type: Number,   
        require: true
    }
})


const historyModel = mongoose.model('History',historySchema)
module.exports = historyModel