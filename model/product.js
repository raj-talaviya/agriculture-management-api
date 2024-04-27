var mongoose = require('mongoose')

var productyschema=new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    qty:{
        type:Number
    },
    cat_id:{
        type:String,
        ref: "category"
    }
})

module.exports=mongoose.model("product",productyschema)