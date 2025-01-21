import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/backend-common/config'

const wss = new WebSocketServer({port: 8080});
interface User{
    ws: WebSocket,
    rooms: string[],
    userId: string
}
const users: User[]  = [];


function checkUser(token: string): string | null{
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(typeof decoded == "string"){
            return null;
        }

        if(!decoded || !decoded.userId){
            return null;
        }

        return decoded.userId;
    } catch (error) {
        return null;
    }
}


wss.on("connection", (ws, request) => {
    const url = request.url; // what url are they trying ot connect to ws://localhost:8080?token=132164645
    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    // ["ws://localhost:8080", "token=132164645"]
    const token = queryParams.get('token') || "";
    // [token = "132164645"]
    const userId = checkUser(token);

    if(userId == null){
        ws.close();
        return;
    }

    users.push({
        ws,
        userId,
        rooms: [],
    })

    ws.on("message", (data) => {
        const parsedData = JSON.parse(data as unknown as string); //{type: "join_room", roomID: 1}

        // subscribe to chats
        if(parsedData.type === "join_room"){
            const user  = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId)
        }

        // unsubscribe from chats
        if(parsedData.type === "leave_room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                return;
            }
            user.rooms = user.rooms.filter(x => x === parsedData.room)
        }

        // broadcast user message to all the users who are in room
        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }

    })
})