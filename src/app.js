import express from "express"
import userRouter from "./routes/userRouter.js"
import { syncDatabase, testConnection } from "./db/sqlite.db.js";
import cookieParser from "cookie-parser";
import { config } from "./config/env.config.js";
import { createServices } from "./services/index.js";

await testConnection();
await syncDatabase();

const app = express();
const services = createServices();
const cookieService = services.cookie;

// LEGGE INN JSON PARSIN (BODY)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(config.auth.cookie.secret));


app.use('/users', userRouter);

// Vårt aller første ENDEPUNKT!
app.get('/', (req, res) => {
    res.send("Hello world!");
});

// Vårt aller første ENDEPUNKT!
app.get('/cookie', (req, res) => {
    const cookie = cookieService.createSignedCookie("test", "cookie!", { secure: true });
    res.cookie(cookie.name, cookie.value, cookie.options);
    res.send();
});

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
