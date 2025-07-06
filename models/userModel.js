
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMOngoose= require('passport-local-mongoose')

const userSchema= new Schema({
    userName:{
        type:String,
        default: "unique User",
    },
    email:{
        type:String,
        default:"test@test.com",
        required:true
       
    },
    phone :Number,
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }]
    
})



userSchema.plugin(passportLocalMOngoose)
module.exports=mongoose.model('User',userSchema)