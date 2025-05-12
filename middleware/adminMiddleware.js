import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Find the user and explicitly select the role field
        const user = await User.findById(req.user.id).select('+role');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        // If the user is an admin, proceed to the next middleware
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default adminMiddleware;
