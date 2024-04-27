var mongoose = require('mongoose')

var cartschema=new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    qty:{
        type:Number
    },
    total:{
        type:Number
    }
})

module.exports=mongoose.model("cart",cartschema)