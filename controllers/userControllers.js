import { validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/**
 * This function handles user registration.
 * It validates the request body, checks if the user already exists, hashes the password, and saves the user to the database.
 * @param {*} req - The request object containing the user data.
 * @param {*} res  - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the user is registered successfully or rejects with an error.
 */
export const register = async (req, res) => {
    const errors = validationResult(req); //
    if(!errors.isEmpty()) { 
        return res.status(422).json({ errors: errors.array() }); 
    }
    const { email, password, name, surname, gender } = req.body; // Destructure data from the request body
    try{
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(422).json({ message: "User already exists" }); // If user already exists, send a 422 response
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`
        //create a new user
        const user = await User({
            name,
            surname,
            profilePicture: gender ==="male" ? boyProfilePic : girlProfilePic,
            email,
            password: hashedPassword,
            gender
        })
        await user.save(); // Save the user to the database

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err); // Log the error to the console
        return res.status(500).json({ message: "Internal server error" }); // Send a 500 response if an error occurs
    }
}
/**
 * This function handles user login.
 * It validates the request body, checks if the user exists, compares the password, and generates a JWT token.
 * @param {*} req - The request object containing the user data.
 * @param {*} res  - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the user is logged in successfully or rejects with an error.
 */
export const login = async (req, res) => {
    const errors = validationResult(req); //Validate the request body
    if(!errors.isEmpty()) { 
        return res.status(422).json({ errors: errors.array() }); 
    }
    const { email, password } = req.body; // Destructure email and password from the request body
    try{
        // Check if the user exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(422).json({ message: "Invalid Email" });
        }
        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(422).json({ message: "Invalid Password" });
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h" 
        }); // Sign the token with the user's ID and a secret key
        return res.status(200).json({message: "Login successful", token }); // Send a success response with the token
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" }); // Send a 500 response if an error occurs
    }
}
/**
 * This function retrieves user data based on the user ID from the request.
 * It excludes the password field from the response.
 * @param {*} req - The request object containing the user ID.
 * @param {*} res  - The response object used to send the response back to the client.
 * @return {Promise<void>} - A promise that resolves when the user data is retrieved successfully or rejects with an error.
 */
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Find the user by ID and exclude the password field
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If user not found, send a 404 response
        }
        return res.status(200).json({ user }); // Send the user data in the response
    } catch (err) {
        console.error(err); // Log the error to the console
        return res.status(500).json({ message: "Internal server error" }); // Send a 500 response if an error occurs
    }
}
/**
 *  This function updates user data based on the user ID from the request.
 * @param {*} req - The request object containing the user data to be updated.
 * @param {*} res  - The response object used to send the response back to the client.
 * @returns  {Promise<void>} - A promise that resolves when the user data is updated successfully or rejects with an error.
 * @throws {Error} - Throws an error if the user is not found or if there is an internal server error.
 */
export const updateUserData = async (req, res) => {
    const errors = validationResult(req); // Validate the request body
    if(!errors.isEmpty()) { 
        return res.status(422).json({ errors: errors.array() }); 
    }
    const { name, surname, gender, email, password } = req.body; // Destructure data from the request body
    try {
        const user = await User.findById(req.user.id); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If user not found, send a 404 response
        }
        // Update the user data
        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.gender = gender || user.gender;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, 10); // Hash the new password if provided
        }
        // Update the profile picture URL based
        await user.save(); // Save the updated user data to the database
        return res.status(200).json({ message: "User data updated successfully" }); // Send a success response
    } catch (err) {
        console.error(err); // Log the error to the console
        return res.status(500).json({ message: "Internal server error" }); // Send a 500 response if an error occurs
    }
}