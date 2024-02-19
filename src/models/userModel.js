const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    password :{
        type : String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    // isAdmin:{
    //     type: Number,
    //     validate: {
    //         validator: function(value) {
    //             return value === 0 || value === 1;
    //         },
    //         message : 'isAdmin field must be either 0 or 1'
    //     }
    // },
    
})


const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;