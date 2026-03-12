import { configDotenv } from "dotenv";
 
configDotenv(); 

export const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8000,
    auth: {
        jwt: {
            secret: process.env.JWT_SECRET || null,
            expiresIn: {
                accessToken: process.env.JWT_ACCESS_TOKEN_EXPIRY || "3h",
                refreshToken: process.env.JWT_REFRESH_TOKEN_EXPIRY || "3d",
            }
        },
        cookie: {
            secret: process.env.COOKIE_SECRET || null,
        }
    },
    db: {
        host: process.env.DB_HOST || null,
        port: process.env.DB_PORT || null,
        name: process.env.DB_NAME || null,
        user: process.env.DB_USER || null,
        password: process.env.DB_PASSWORD || null,
        dialect: process.env.DB_DIALECT || null,
        // db.sqlite -> 
        storage: process.env.DB_STORAGE?.replace("db", process.env.NODE_ENV === "test" ? "db.test" : "db") || null,
    }
}
