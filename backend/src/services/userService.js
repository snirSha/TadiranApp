import User from "../models/userModel.js";
import Warranty from "../models/warrantyModel.js";
import dotenv from 'dotenv';
dotenv.config();

const getUsers = async () => {
    const authorizedAdmins = process.env.ADMIN_EMAILS?.split(",") || [];

    return await User.find({ email: { $nin: authorizedAdmins } }) // filters users that are not admin
        .select("-password");
};

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

const deleteUsers = async (userIds) => {//Admin can delete a few records
    const existingUsers = await User.find({ _id: { $in: userIds } });
    console.log("Existing Users before deletion:", existingUsers);

    const result = await User.deleteMany({ _id: { $in: userIds } });

    if (result.deletedCount > 0) {
        await Warranty.deleteMany({ userId: { $in: userIds } }); // delete the warranties that are connected to a deleted user
        console.log(`🔹 Deleted warranties for users: ${userIds}`);
    }

    return result.deletedCount > 0 ? userIds : null;
};

export {getUsers, getUserById, updateUserById, deleteUsers};