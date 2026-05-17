const router = require("express").Router();
const controller = require("../controllers/orderController");

router.post("/buy/:id", controller.buyProduct);

module.exports = router;