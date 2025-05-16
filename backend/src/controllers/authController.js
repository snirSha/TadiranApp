import { signup, login } from '../services/authService.js';
import User from '../models/userModel.js';

// Handling HTTP requests and responses
const signupController = async (req, res, next) => {
    console.log("req.body", req.body);
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, Email and password are required." });
        }

        const passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain both letters and numbers." });
        } 

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Send a structured error response
            return res.status(400).json({
                success: false,
                message: 'Email is already taken',
            });
        }

        const newUser = await signup({ name, email, password });
        // Respond with token and user data
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        next(error); // Pass the error to the middleware
    }
};

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const { user, token } = await login(email, password);
        // Respond with token and user data
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        // If it's an authentication error (invalid credentials)
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // For other errors (like internal server issues)
        next(error); // Pass the error to the middleware
    }
};

export { signupController, loginController };