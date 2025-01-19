import express from "express"
import { middleware } from "./middleware";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config'
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"

const app = express();

app.post("/signup", (req, res) => {
    // db call
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        userId: "123"
    })

})
app.post("/signin", (req, res) => {
    const data = SignInSchema.safeParse(req.body);

    if(!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})
app.post("/room", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message: "Incorrect Credentials"
        })
        return;
    }
// db call
    res.json({
        roomId: 123
    })
})

app.listen(3000);