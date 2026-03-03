import { User } from "../../models/user.model.js";

export const deleteUser = async (req, res) => {
    console.log("[Handler] Request ID:", req.requestId);
    
    const { params: { id } } = req.validated;

    const user = await User.findByPk(id);

    if (user === null) {
        res.sendStatus(404);
        return;
    }

    await user.destroy();

    res.status(204).json(user.toJSON());
};