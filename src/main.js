import  express  from "express";
import { MONGODB_CNX_STR, PORT } from "./config.js";
import {connect} from "mongoose";
import { apiRouter } from "./routers/api.router.js";
import {engine} from "express-handlebars";

await connect(MONGODB_CNX_STR)
console.log("Base de datos conectada");

const app = express()
app.listen(PORT, () => {
    console.log("Conectado al puerto 8080")
})

app.use("/api", apiRouter);

app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");



