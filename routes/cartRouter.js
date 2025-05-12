import express from 'express';
import { body } from 'express-validator';
const cartRouter = express.Router();
import {addToCart, getCart, removeFromCart} from '../controllers/cartController.js';

cartRouter.post("/cart", [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be greater than 0"),
],
  addToCart
);

cartRouter.get("/cart/:id", getCart);

cartRouter.delete("/cart/:id", removeFromCart);

export default cartRouter;