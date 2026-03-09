import { Op } from "sequelize";
import { User } from "../models/user.model.js";
import { createHttpError } from "../utils/http-error.js";

export class UserService {
    async createUser({ name, email, password, roles = ["user"] }) {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            throw createHttpError(409, "Email already in use.");
        }

        const createdUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            roles,
        });

        return createdUser;
    }

    async listUsers() {
        const users = await User.findAll({
            order: [["createdAt", "DESC"]],
        });

        return users.map((user) => user.toJSON());
    }

    async findById(id) {
        return User.findByPk(id);
    }

    async getByIdOrThrow(id) {
        const user = await this.findById(id);

        if (!user) {
            throw createHttpError(404, "User not found.");
        }

        return user;
    }

    async deleteById(id) {
        const user = await this.getByIdOrThrow(id);
        const deletedUser = user.toJSON();

        await user.destroy();
        return deletedUser;
    }

    async assignRoles(id, roles) {
        const user = await this.getByIdOrThrow(id);
        user.roles = roles;

        await user.save();
        return user.toJSON();
    }

    async findByIdentifier(identifier) {
        const normalizedIdentifier = identifier.trim();

        return User.findOne({
            where: {
                [Op.or]: [
                    { email: normalizedIdentifier.toLowerCase() },
                    { name: normalizedIdentifier },
                ],
            },
        });
    }
}
