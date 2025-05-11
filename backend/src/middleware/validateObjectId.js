import mongoose from "mongoose";

const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id) {
            return res.status(400).json({ message: `Missing ${paramName} in request parameters` });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid ${paramName}` });
        }
        next();
    };
};

export default validateObjectId;
