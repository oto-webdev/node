import jwt from "jsonwebtoken";
import { Response } from "express";

export const createToken = (id: string, res: Response): string => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return token;
};
