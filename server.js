import express from 'express';
import connectDB from './config/db.js';
import userRoutes  from './routes/userRoutes.js';
import dotenv from 'dotenv';
dotenv.config({path: './config/.env'});

const app = express();
connectDB(); // Connect to the database
app.use(express.json()); // Middleware to parse JSON requests
app.use("/user", userRoutes); // Use user routes for all requests to /user
const PORT = process.env.PORT || 5000; // Set the port to listen on

app.listen(PORT, () => {
    console.log(`http://localhost:3000 server is running`); // Log the server start message
})