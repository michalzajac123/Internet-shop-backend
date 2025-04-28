const Order = require("../models/orderModel");

exports.checkout = async (req, res) => {
  const cartId = req.params.cartId;

  try {
    const currentCart = await Cart.findById(cartId).populate("products.productId");
    if (!currentCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const userId = req.params.id;
    const products = currentCart.products;
    const totalAmount = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Retrieve past orders for a user. This function fetches all past orders for the user
 * based on the provided user ID in the request parameters. If the orders are found, it sends them as a response.
 * If an error occurs during the process, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing the user ID in the parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.getPastOrdersByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Retrieve all past orders. This function fetches all past orders from the database.
 * If the orders are found, it sends them as a response.
 * If an error occurs during the process, it sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the user ID in the parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.getPastOrders = async (req, res) => {
  try {
    const orders = await Order.findAll().populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}


/**
 * @description Update the status of an order. This function updates the status of an order based on the provided order ID
 * in the request parameters. If the order is found and updated successfully, it sends the updated order as a response.
 * If the order is not found or an error occurs, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing the order ID in the parameters and new status in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.updateStatusOfOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;

    await order.save();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
  res.status(200).json({ msg: "Status of order is changed" });
};
