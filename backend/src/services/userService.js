import User from "../models/userModel.js";

const getUsers = async() => {
    return await User.find().select('-password');//exclude password from result
}

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if(!user) throw new Error('User not found');
    return user;
}

const updateUserById = async (userId, updateData) => {
    const user = await getUserById(userId);
    Object.assign(user, updateData);
    await user.save();
    return user;
}

const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if(!user) throw new Error('User not found');
    return user;
}

export {getUsers, getUserById, updateUserById, deleteUser};