import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, decodedToken: any) => {
                if (err) {
                    console.log(err.message);
                    res.locals.user = null;
                    next();
                } else {
                    if (decodedToken) {
                        let user = await User.findById(decodedToken.id);
                        res.locals.user = user;
                    }
                    next();
                }
            });
        } else {
            res.locals.user = null;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user && res.locals.user.role === "admin") {
        next();  
    } else {
        res.status(403).json({ message: "Forbidden" });  
    }
};

export { auth, isAdmin };
