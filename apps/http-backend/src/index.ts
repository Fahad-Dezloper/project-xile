import express from "express"
import { middleware } from "./middleware";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config'
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    // db call
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                // hash the password
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })   
    } catch (error) {
        res.status(411).json({
            message: "user with this email already exist"
        })
    }

})

app.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // todo compare the hash pasword
   const user = await prismaClient.user.findFirst({
    where: {
        email: parsedData.data.username,
        password: parsedData.data.password
    }
   })

   if(!user){
        res.status(403).json({
            message: "Not authorized"
        })
        return;
   }
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, async(req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Incorrect Credentials"
        })
        return;
    }
    // @ts-ignore
    const userId = req.userId;

    await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            admin: userId
        }
    })

    res.json({
        roomId: 123
    })
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001);