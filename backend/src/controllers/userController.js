import {getUsers, getUserById, updateUserById, deleteUser} from '../services/userService.js';

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

const deleteUserController = async (req, res, next) => {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};

export {getUsersController, getUserByIdController, updateUserDetailsController, deleteUserController};