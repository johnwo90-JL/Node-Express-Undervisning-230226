import { Sequelize } from "sequelize";
import { config } from "./env.config.js";

const { db } = config;

// ORM - Object Relation(al) Model
// {
//     firstName: string, // <-> text, varchar, char(n), json ==> first_name ==> firstName
//     email: string,
//     age: number, // <-> integer, bigint, wholeNumber
// }


export const sequelize = new Sequelize(db.name, db.user, db.password, {
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    storage: db.storage,

    foreignKeys: true,

    logging: config.env === "development" ? console.log : false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

    timezone: "+00:00",

    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false
    }
});

// createdAt, updatedAt, [deletedAt]
 