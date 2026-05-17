const router = require("express").Router();
const controller = require("../controllers/productController");

router.get("/", controller.getProducts);
router.post("/", controller.addProduct);

module.exports = router;