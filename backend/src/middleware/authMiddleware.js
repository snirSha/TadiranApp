import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Invalid token, authorization denied" });
        }

        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user.isAdmin = decoded.hasOwnProperty("isAdmin") ? decoded.isAdmin : false; 
        // console.log("req.user.isAdmin: ",req.user.isAdmin);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        // console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Invalid token, access denied" });
    }
};

export default authMiddleware;