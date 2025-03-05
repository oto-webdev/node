import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Post from "../models/post.model";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.status(200).json({ posts });
})

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title } = req.body;
    
    if (!res.locals.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const user = res.locals.user;

    const post = await Post.create({
        title,
        user: user._id, 
    });

    res.status(201).json({ post });
});
