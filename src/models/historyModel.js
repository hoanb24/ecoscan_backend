const mongoose = require('mongoose')
const moment = require('moment')

const historySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    create_at : {
        type: Date,
        default: moment().toDate(),
    },
    barcode_number: {
        type: Number,   
        require: true
    }
})


const historyModel = mongoose.model('History',historySchema)
module.exports = historyModel