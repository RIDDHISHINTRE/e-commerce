const Order = require("../models/Order");
const Product = require("../models/Product");

exports.buy = async (id, qty) => {

    const product = await Product.findById(id);

    if (!product) throw new Error("Product not found");

    const order = new Order({
        productId: id,
        productName: product.name,
        quantity: qty,
        totalPrice: product.price * qty
    });

    return await order.save();
};