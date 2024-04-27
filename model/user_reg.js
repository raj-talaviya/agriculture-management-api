var mongoose = require('mongoose')

var regschema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    mobile:{
        type:Number
    }
})

module.exports=mongoose.model("reg",regschema)