//Middleware to check if user or admin is trying to get to a route
const isAdminMiddleware = (req, res, next) => {
    console.log("User Data:", req);
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

export default isAdminMiddleware;