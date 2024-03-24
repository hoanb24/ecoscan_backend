const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    password :{
        type : String,
        required: false
    },
    email:{
        type: String,
        required:true
    },
    phone: {
        type:Number,
        require: false
    }
    ,
    avatar : {
        type: String,
        require:false
    }
    ,
    resetPasswordToken: {
        type: String,
        default: null, 
    },
    resetPasswordExpire: {
        type: Date,
        default: null, 
    },
})


const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;