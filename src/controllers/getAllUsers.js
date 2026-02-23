import { users } from "../store/users.js";


export const getAllUsers = (req, res) => {
    res.status(200).json(users);
};