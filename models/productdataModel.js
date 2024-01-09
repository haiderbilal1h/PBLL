const mongoose = require("mongoose");

const productdataSchema = new mongoose.Schema({
    name:String,
    ml:Number,
    type:String,
    manufactured_date:{
        type:Date
    },
    expirydate:Date,
    productid:{   
    type:mongoose.Schema.Types.ObjectId,
    ref:"product"
},
shortexp:Boolean
});

module.exports = mongoose.model("productdata",productdataSchema);