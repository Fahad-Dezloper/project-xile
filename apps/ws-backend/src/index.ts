import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/backend-common'

const wss = new WebSocketServer({port: 8080});

wss.on("connection", (ws, request) => {
    const url = request.url; // what url are they trying ot connect to ws://localhost:8080?token=132164645
    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    // ["ws://localhost:8080", "token=132164645"]
    const token = queryParams.get('token') || "";
    // [token = "132164645"]

    const decoded = jwt.verify(token, JWT_SECRET);

    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
    }

    ws.on("message", (data) => {
        ws.send("pong");
    })
})