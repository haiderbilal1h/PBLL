const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:String,
    quantity:Number,
    instock:Boolean,
    itemsexpired:Number,
    data: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "productdata"
    }]
});

module.exports = mongoose.model("product",productSchema);