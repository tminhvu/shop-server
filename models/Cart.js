const mongoose = require('mongoose')

const CARTSCHEMA = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    products: [{
        productid: { type: String },
        quantity: { type: Number, default: 1 }
    }],
}, { timestamps: true })

module.exports = mongoose.model("Cart", CARTSCHEMA)
