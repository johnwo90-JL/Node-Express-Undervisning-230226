import { User } from "../../models/user.model.js";



export const getAllUsers = async (req, res) => {
    console.log("[Handler] Request ID:", req.requestId);

    res.status(200).json(await User.findAll());
};