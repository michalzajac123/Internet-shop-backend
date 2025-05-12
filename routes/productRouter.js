import express from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
const productRouter = express.Router();
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  filterProducts, 
  approveProduct 
} from '../controllers/productController.js';

productRouter.post("/product",
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("photo").notEmpty().withMessage("Photo is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("subcategory").notEmpty().withMessage("Subcategory is required"),
    createProduct
);

productRouter.get("/products", getAllProducts);

productRouter.get("/product/:id",
    param("id").isMongoId().withMessage("Invalid product ID"),
    getProductById
);

productRouter.get("/filter", filterProducts);

// Admin middleware added to protect the approval route
productRouter.put("/product/:id/approve",
    authMiddleware,
    adminMiddleware,
    param("id").isMongoId().withMessage("Invalid product ID"),
    approveProduct
);

export default productRouter;