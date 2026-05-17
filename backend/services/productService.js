const Product = require("../models/Product");

exports.getAll = async () => Product.find();

exports.create = async (data) => new Product(data).save();