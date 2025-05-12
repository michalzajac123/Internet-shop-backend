import { validationResult } from "express-validator";
import Category from "../models/Category.js";


/** 
 * @description Show all categories and their subcategories.
 * This function retrieves all categories from the database and sends them as a response.
 * 
 * @param {Object} req - The request object used to fetch all categories.
 * @param {Object} res - The response object used to send back the HTTP response. 
*/
export const showAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
