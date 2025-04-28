import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" }); // If no token is provided, return 401 Unauthorized
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Call the next middleware or route handler
    } catch(err) {
        console.error(err); // Log the error to the console
        return res.status(403).json({ message: "Forbidden" }); // If token verification fails, return 403 Forbidden
    }
}