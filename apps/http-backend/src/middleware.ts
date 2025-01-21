import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next:NextFunction){
    
    const token = req.headers["authorization"] ?? "";
    console.log("here token", token ? token : "no token found");
    console.log("no token ddd");

    
    
    
    const decoded = jwt.verify(token, JWT_SECRET);

    if(decoded){
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}