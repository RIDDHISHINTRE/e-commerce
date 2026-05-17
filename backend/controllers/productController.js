const service = require("../services/productService");

exports.getProducts = async (req, res) => {
    res.json(await service.getAll());
};

exports.addProduct = async (req, res) => {
    res.json(await service.create(req.body));
};