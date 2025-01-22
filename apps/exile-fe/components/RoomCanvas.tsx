"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MGIwY2MyZS1hYjgzLTQxN2UtYjBkOS03ZGVhOTllYTA4YjMiLCJpYXQiOjE3Mzc1MzY1NzF9.wXaRPXi6_MxAiBUo6UWJtuVfhw6DN41hFwahReu1ynM`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

    }, [])

    if(!socket){
        return <div>Connecting to server...</div>
    }
    
    return (
        <div className="w-full h-screen">
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )

}