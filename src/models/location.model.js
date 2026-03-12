import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";


const locationModelSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    longitude: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    label: {
        type: DataTypes.STRING,
        defaultValue: "[DEFAULT]",
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "[DEFAULT]",
    },
    difficulty: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    }
};


export const Location = sequelize.define("Location", locationModelSchema, {
    tableName: "Locations",
    timestamps: true,
});



Location.prototype.distanceTo = function ({lat, lng}) {
    const R = 6371e3; // metres coefficient
    const phi1 = lat * Math.PI/180; // phi, lambda in radians
    const phi2 = this.latitude * Math.PI/180;
    const deltaPhi = (this.latitude-lat) * Math.PI/180;
    const deltaLambda = (this.longitude-lng) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

/** @returns {Record<keyof typeof locationModelSchema, any>} */
Location.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
}


