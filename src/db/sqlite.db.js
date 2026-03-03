import { sequelize } from "../config/db.config.js";


export async function syncDatabase(options) {
    try {
        await sequelize.sync(options);
        console.log("Synced models to database.");
    } catch (error) {
        console.error("Failed to synchronize models to database.");
        throw error;
    }
}

export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.debug("Connected to database");
    } catch (err) {
        console.error("Test connection failed with error:", err);
        throw err;
    }
}
