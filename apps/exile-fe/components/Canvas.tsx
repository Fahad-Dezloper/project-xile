"use client"
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Eraser, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

export type Tool = "circle" | "rect" | "pencil" | "eraser";

export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool, game])

    useEffect(() => {
        if(canvasRef.current){
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g);

            return () => {
                g.destroy()
            }
        }
    }, [canvasRef])

    return <div className="relative w-full h-full">
        <ReactFlow
        nodes={[]}
        edges={[]}        
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        zoomOnScroll={true}
        panOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
      >
         <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
        <Controls />
        <Background color="#eee" gap={20} />
        </ReactFlow>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}){
    return <div className="flex gap-3 absolute bottom-8 right-8">
        <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
        <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("eraser")
                }} activated={selectedTool === "eraser"} icon={<Eraser />}></IconButton>

</div>
}