import { users } from "../../store/users.js";


export const getAllUsers = (req, res) => {
    console.log("[Handler] Request ID:", req.requestId);

    res.status(200).json(users);
};