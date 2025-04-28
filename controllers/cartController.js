const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * @description Add a product to the user's cart. This function validates the request body,
 * checks if the product exists, and updates the cart accordingly. If the product is already in the cart,
 * it updates the quantity. If the product is not found or an error occurs, it sends an appropriate error response.
 *
 *  @param {Object} req - The request object containing product ID and quantity in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, quantity } = req.body;
  const userId = req.params.id;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update the quantity of the existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add a new item to the cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Show the user's cart. This function retrieves the cart for the user and sends it as a response.
 * If the cart is not found or an error occurs, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing the user ID in the request object.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.getCart = async (req, res) => {
  const userId = req.params.id; // Assuming you have user ID in req.user

  try {
    // Check if the cart exists for the user
    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Remove a product from the user's cart. This function validates the request body,
 * checks if the cart exists, and removes the specified product from the cart. If the cart is not found
 * or an error occurs, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing product ID in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
exports.removeFromCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.body;
  const userId = req.params.id;

  try {
    // Check if the cart exists for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the product is in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.items.splice(existingItemIndex, 1);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
