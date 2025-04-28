const express = require('express');
const { validator } = require('express-validator');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');

cartRouter.post("/cart", 
  validator("productId").isMongoId().withMessage("Invalid product ID"),
  validator("quantity").isInt({ gt: 0 }).withMessage("Quantity must be greater than 0"),
  cartController.addToCart
);

cartRouter.get("/cart/:id", cartController.showCart);

cartRouter.delete("/cart/:id", cartController.deleteCart);


module.exports = cartRouter;