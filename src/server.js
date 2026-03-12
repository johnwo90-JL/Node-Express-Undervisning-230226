import app from "./app.js";
import { config } from "./config/env.config.js";


const port = config.port;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})