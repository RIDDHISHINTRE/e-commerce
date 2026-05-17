const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    quantity: Number,
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);