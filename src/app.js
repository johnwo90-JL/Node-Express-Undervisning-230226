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
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createLocationsController } from "./controllers/locations.controller.js";
import { createLocationsRouter } from "./routes/locations.router.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi.js";

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

const locationsController = createLocationsController({
    logger: services.logger,
    locationsService: services.location,
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

const locationsRouter = createLocationsRouter({
    locationsController,
    authMiddlewares
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes'
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

app.get("/docs/openapi.json", (req, res) => {
    res.status(200).json(openApiDocument);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(helmet()); // @see https://www.npmjs.com/package/helmet
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
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
app.use("/locations", locationsRouter);



// "Endestasjon" -> "Catch-all"
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.log({
        success: false,
        statusCode,
        message,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

export default app;
