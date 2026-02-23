import { users } from "../store/users.js";

export const deleteUser = (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: "Invalid ID"
        })
    }
    // 

    const userIndex = users.findIndex((user) => user.id === Number(id));

    if (userIndex === -1) {
        return res.status(404).json({
            message: `User with id ${id} not found.`,
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.status(200).json({
        message: "User deleted successfully",
        data: deletedUser[0],
    });
};