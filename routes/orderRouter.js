import express from "express";
import { checkout, getPastOrders, getPastOrdersByUserId, updateStatusOfOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/checkout/:cartId/:id", checkout);

orderRouter.get("/orders", getPastOrders);

orderRouter.get("/orders/:id", getPastOrdersByUserId);

orderRouter.put("/updateStatus/:id", updateStatusOfOrder);

export default orderRouter;
