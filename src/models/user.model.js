import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { UserRoles } from "../constants/roles.constants.js";

import bcrypt from "bcrypt";


export const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // RBAC - Role-based Access Control
    roles: {
        type: DataTypes.JSON, // DataTypes.ARRAY(DataTypes.ENUM(["admin", "user"])),
        defaultValue: ["user"],
        allowNull: false,

        validate: {
            isValidRole(value) {
                if (!Array.isArray(value) || !value.every(role => UserRoles.includes(role))) {
                    throw new Error("Invalid user role array. Aborting operation.");
                }
            }
        }
    },
}, {
    tableName: "Users",
    timestamps: true,

    hooks: {
        async beforeCreate(user) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },

        async beforeUpdate(user) {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    }
});

User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

User.prototype.toJSON = function () {
    const values = { ...this.get() }; // Deep-copy
    delete values.password;
    return values;
}


