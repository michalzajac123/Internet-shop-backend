const { validationResult } = require("express-validator");
const Category = require("../models/Category");


/** 
 * @description Show all categories and their subcategories.
 * This function retrieves all categories from the database and sends them as a response.
 * 
 * @param {Object} req - The request object used to fetch all categories.
 * @param {Object} res - The response object used to send back the HTTP response. 
*/
exports.showAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
