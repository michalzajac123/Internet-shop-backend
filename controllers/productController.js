const { validationResult } = require("express-validator");
const Product = require("../models/Product");

/**
 * @description Create a new product in the database. This function validates the request body,
 * extracts product details, and saves a new product to the database. If validation fails or
 * an error occurs during the process, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing product details in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, photo, category, subcategory } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      photo,
      category,
      subcategory,
      status: "inactive",
    });

    await newProduct.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Retrieve all products from the database. This function fetches all products and sends them as a response.
 * If an error occurs during the process, it sends an appropriate error response.
 *
 * @param {*} req - The request object used to fetch all products.
 * @param {*} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Retrieve a single product by its ID. This function fetches the product from the database
 * based on the provided ID in the request parameters. If the product is found, it sends the product data
 * as a response. If the product is not found or an error occurs, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing the product ID in the parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Update a product by its ID. This function fetches the product from the database based on the provided ID
 * in the request parameters. If the product is found, it updates the product details with the provided data in the request body.
 * If the product is not found or an error occurs, it sends an appropriate error response.
 *
 * @param {Object} req - The request object containing the product ID in the parameters and updated product data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @return {void}
 */
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "active"; 
    
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
* @description Filter products based on query parameters. This function allows filtering products
* by category, subcategory, or name. It constructs a query object based on the provided query parameters
* and retrieves matching products from the database. If an error occurs during the process, it sends
* an appropriate error response.
*
* @param {Object} req - The request object containing query parameters for filtering products.
* @param {Object} res - The response object used to send back the HTTP response.
* @return {void}
*/
exports.filterProducts = async (req, res) => {
  const { category, subcategory, name } = req.query;
  try {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (name) {
      query.name = name;
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
