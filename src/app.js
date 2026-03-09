import express from "express"
import { syncDatabase, testConnection } from "./db/sqlite.db.js";
import cookieParser from "cookie-parser";
import { config } from "./config/env.config.js";
import { createAuthController } from "./controllers/auth.controller.js";
import { createUsersController } from "./controllers/users.controller.js";
import { createAuthMiddlewares } from "./middlewares/use-auth.middleware.js";
import { createAuthRouter } from "./routes/auth.router.js";
import { createUsersRouter } from "./routes/users.router.js";
import { createServices } from "./services/index.js";
import "./models/session-token.model.js";

await testConnection();
await syncDatabase();

const app = express();
const services = createServices();
const authController = createAuthController({
    authService: services.auth,
    cookieService: services.cookie,
    env: config.env,
});
const usersController = createUsersController({
    userService: services.user,
    logger: services.logger,
});
const authMiddlewares = createAuthMiddlewares({
    authService: services.auth,
});
const authRouter = createAuthRouter({
    authController,
    authMiddlewares,
});
const usersRouter = createUsersRouter({
    usersController,
    authMiddlewares,
});

// LEGGE INN JSON PARSIN (BODY)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(config.auth.cookie.secret));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "OK",
    });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);

// "Endestasjon" -> "Catch-all"
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.log({
        success: false,
        statusCode,
        message,
    });

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

export default app;
