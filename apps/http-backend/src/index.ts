import express from "express"
import { middleware } from "./middleware";

const app = express();

app.post("/signup", (req, res) => {

})
app.post("/signin", (req, res) => {

})
app.post("/room", middleware, (req, res) => {

})

app.listen(3000);