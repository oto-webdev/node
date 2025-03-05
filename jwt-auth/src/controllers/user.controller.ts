import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/user.model";
import asyncHandler from "../middleware/asyncHandler";
import { createToken } from "../utils/createToken";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Please add all fields" });
        return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(409).json({ message: "User already exists" });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters" });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user", 
        });
    
        const token = createToken(user.id, res);
    
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }catch(error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Please add all fields" });
        return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(409).json({ message: "User already exists" });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters" });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{    
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin", 
        });
    
        const token = createToken(user.id, res);
    
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }catch(error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please add all fields" });
        return;
    }

    const user = await User.findOne({ email });

    if (!user) {    
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    try{
        const token = createToken(user.id, res);
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }catch(error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})

export const logOutUser = asyncHandler(async (req: Request, res: Response) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out" });
    }catch(error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})