import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const authorizedAdmins = process.env.ADMIN_EMAILS.split(",");

const signup = async (userData, file) => {
    const { name, email, password } = userData;
    if(!name || !email || !password) throw new Error('Please provide all fields');

    const user = new User({ name, email, password});
    await user.save();
    return user;
};

const login = async (email, password) => {
    const user = await User.findOne({email});
    if(!user)throw new Error('User not found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid credentials');

    const isAdmin = authorizedAdmins.includes(email);//check if the user mail is one from the admin users

    const token = jwt.sign({userId: user._id, isAdmin}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return {user, token};
}

export { signup, login };