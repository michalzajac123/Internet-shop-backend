const express = require("express");
const { validator } = require("express-validator");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");

orderRouter.post("/checkout/:cartId/:id", orderController.checkout);

orderRouter.get("/orders", orderController.getPastOrders);

orderRouter.get("/orders/:id", orderController.getPastOrdersByUserId);

orderRouter.put("/updateStatus/:id", orderController.updateStatusOfOrder);

module.exports = orderRouter;
