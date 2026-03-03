import { User } from "../../models/user.model.js";


export const getUserByID = async (req, res) => {
    console.log("[Handler] Request ID:", req.requestId);

    const { params: { id } } = req.validated;

    const user = await User.findByPk(id);

    if (user === null) {
        res.sendStatus(404);
        return;
    }

    res.status(200).json(user.toJSON());
}