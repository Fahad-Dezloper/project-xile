"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MGIwY2MyZS1hYjgzLTQxN2UtYjBkOS03ZGVhOTllYTA4YjMiLCJpYXQiOjE3Mzc0ODUwMTF9.srqJjMF4mEAezJ3uDds_zzfDZwM2fO-xSTd8DG29yC0`)

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
        <div className="relative w-full h-screen">
            <Canvas roomId={roomId} socket={socket} />
        <div className="flex gap-3 absolute bottom-8 right-8">
            <button className="p-3 text-lg font-semibold rounded-lg bg-blue-300 hover:bg-blue-400 duration-150 text-white">Rectangle</button>
            <button className="p-3 text-lg font-semibold rounded-lg bg-blue-300 hover:bg-blue-400 duration-150 text-white">Circle</button>
        </div>
        </div>
    )

}