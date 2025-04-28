import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male","female"]
    },
    profilePicture: {
        type: String,
        default: "", // Default profile picture URL
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        select: false, // Prevents the role from being returned in queries by default
        immutable: true, // Makes the role property immutable after creation
    }
});
export default mongoose.model("User", userSchema); 