import { users } from "../store/users.js";


export const getUserByID = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: "Invalid ID!"
        })
    }

    const user = users.find(userObj => userObj.id === id);
    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }
    return res.status(200).json({data: user})
}