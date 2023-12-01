import  express  from "express";
import { MONGODB_CNX_STR, PORT } from "./config.js";
import {connect} from "mongoose";
import { apiRouter } from "./routers/api.router.js";

await connect(MONGODB_CNX_STR)
console.log("Base de datos conectada");

const app = express()
app.listen(PORT, () => {
    console.log("Conectado al puerto 8080")
})

app.use("/static", express.static("./static"))

app.use("/api", apiRouter);