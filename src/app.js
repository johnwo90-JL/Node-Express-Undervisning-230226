import express from "express"
import userRouter from "./routes/userRouter.js"
import { syncDatabase, testConnection } from "./db/sqlite.db.js";

await testConnection();
await syncDatabase();

const app = express();

// LEGGE INN JSON PARSIN (BODY)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/users', userRouter);

// Vårt aller første ENDEPUNKT!
app.get('/', (req, res) => {
    res.send("Hello world!");
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


/*
Dagens plan:
- Laste ned Postman Applikasjonen
- Vi skal lage et SCRIPT (package.json)
- CRUD: Create, Read, Update, Delete
*/