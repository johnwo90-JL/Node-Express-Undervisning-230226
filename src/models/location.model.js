import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";


export const Location = sequelize.define("Location", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    latitude: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    label: {
        type: DataTypes.STRING,
        defaultValue: "[DEFAULT]",
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "[DEFAULT]",
    },
    difficulty: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    }
}, {
    tableName: "Locations",
    timestamps: true,
});

Location.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
}


