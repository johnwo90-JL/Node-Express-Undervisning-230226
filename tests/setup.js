import fs from "node:fs";
import path from "node:path";

import { afterAll, beforeAll } from "vitest";
import { config } from "../src/config/env.config";
import { syncDatabase } from "../src/db/sqlite.db";


function deleteTestDatabase() {
    const dbPath = path.resolve("..", config.db.storage);

    if (fs.existsSync(dbPath)) {
        fs.unlink(dbPath);
    }
}



export const setupTests = () => {
    beforeAll(async () => {
        await syncDatabase();
        deleteTestDatabase();
    });
    
    afterAll(async () => {
        await syncDatabase();
        deleteTestDatabase();
    });
};
