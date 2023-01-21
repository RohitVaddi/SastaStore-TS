import express from "express";
import connection from "./connection/db";
import router from "./routes";

const app = express();
connection()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const PORT: number = 3000
app.listen(PORT, () => {
    console.log(`Server listening on port 3000`);
});