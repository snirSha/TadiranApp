import {getUsers, getUserById, updateUserById, deleteUsers} from '../services/userService.js';

const getUsersController = async (req, res, next) => {
    try {
        const users = await getUsers();
        res.status(200).json({
            message: 'Users retrieved successfully',
            users
        });
    }catch (error){
        next(error);
    }
}

const getUserByIdController = async (req, res, next) => {
    const {id} = req.params;
    try{
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }catch (error){
        next(error);
    }
}

const updateUserDetailsController = async (req, res, next) => {
    const { name, email } = req.body;

    try {
        // Validate title and user
        if (!name && !email) {
            return res.status(400).json({ message: "Name or email are required." });
        }
        // Validate UserId goes in the validateObjectId middelware
        // console.log("In backend userControler req.body: ",req.body);
        const user = await updateUserById(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};

const deleteUsersController = async (req, res, next) => {
    try {
        console.log("Received delete request for users:", req.body);
        const { ids } = req.body;
        if (!ids || !ids.length) {
            return res.status(400).json({ success: false, message: "No user IDs provided." });
        }

        const deletedIds = await deleteUsers(ids);

        if (!deletedIds) {
            return res.status(404).json({ success: false, message: "No users found to delete, possibly linked to warranties." });
        }

        res.status(200).json({ success: true, ids: deletedIds }); // ✅ החזרת `success: true` בפורמט תקין
    } catch (error) {
        console.error("Error deleting users:", error);
        res.status(500).json({ success: false, message: "Error deleting users" });
    }
};

export {getUsersController, getUserByIdController, updateUserDetailsController, deleteUsersController};