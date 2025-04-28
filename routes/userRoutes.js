import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

import { register, login,updateUserData, getUserData } from "../controllers/userControllers.js";

router.post("/register", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], register);

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], login);

router.get("/userData/:userId", authMiddleware, getUserData);
router.put("/updateUserData/:userId", authMiddleware, updateUserData);

router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: "Welcome to the admin route" });
});