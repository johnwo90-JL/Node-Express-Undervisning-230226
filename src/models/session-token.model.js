import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { User } from "./user.model.js";

export const SessionToken = sequelize.define("SessionToken", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "SessionTokens",
    timestamps: true,
});

User.hasMany(SessionToken, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

SessionToken.belongsTo(User, {
    foreignKey: "userId",
});
