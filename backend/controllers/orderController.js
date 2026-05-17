const service = require("../services/orderService");

exports.buyProduct = async (req, res) => {
    const order = await service.buy(req.params.id, 1);
    res.json({ message: "Order placed", order });
};