const express = require('express');
const { validator } = require('express-validator');
const productRouter = express.Router();
const productController = require('../controllers/productController');


productRouter.post("/product",
    validator("name").notEmpty().withMessage("Name is required"),
    validator("description").notEmpty().withMessage("Description is required"),
    validator("price").isNumeric().withMessage("Price must be a number"),
    validator("photo").notEmpty().withMessage("Photo is required"),
    validator("category").notEmpty().withMessage("Category is required"),
    validator("subcategory").notEmpty().withMessage("Subcategory is required"),
    productController.createProduct
);

productRouter.get("/products", productController.getAllProducts);

productRouter.get("/product/:id",
    validator("id").isMongoId().withMessage("Invalid product ID"),
    productController.getProductById
);

productRouter.get("/products", productController.filterProducts);

// TODO: add middleware to check if the user is an admin
productRouter.put("/product/:id/approve",
    validator("id").isMongoId().withMessage("Invalid product ID"),
    productController.approveProduct
);

module.exports = productRouter;