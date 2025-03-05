import mongoose from "mongoose";
import { query, Request, Response } from 'express'
import Book from "../models/book.model";

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    const { minPrice, maxPrice, page = 1, limit = 10, search = '' } = req.query;

    try {
        let query: any = {};

        if (minPrice && maxPrice) {
            query.price = {
                $gte: minPrice,
                $lte: maxPrice
            };
        }

        if (search) {
            query = {
                ...query, 
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        const skip = (pageNumber - 1) * limitNumber;

        const books = await Book.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        if (!books || books.length === 0) {
            res.status(404).json({ message: "Books not found" });
            return;
        }

        const totalBooks = await Book.countDocuments(query);

        const totalPages = Math.ceil(totalBooks / limitNumber);

        res.status(200).json({
            books,
            page: pageNumber,
            totalPages,
            totalBooks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" })
        return;
    }   

    try{
        const book = await Book.findById(id);

        if(!book) {
            res.status(404).json({ message: "Book not found" })
            return;
        }

        res.status(200).json(book);
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const createBook = async (req: Request, res: Response): Promise<void> => {
    const { title, description, price, image } = req.body;

    if(!title || !description || !price || !image) {
        res.status(400).json({ message: "All fields are required" })
        return;
    }

    try{
        const book = await Book.create({ 
            title, 
            description, 
            price, 
            image 
        });

        res.status(201).json(book);
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" })
        return;
    }

    try{
        const book = await Book.findByIdAndUpdate(id, req.body, { new: true });

        if(!book) {
            res.status(404).json({ message: "Book not found" })
            return;
        }

        res.status(200).json(book);
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" })
        return;
    }

    try{
        const book = await Book.findByIdAndDelete(id);

        if(!book) {
            res.status(404).json({ message: "Book not found" })
            return;
        }

        res.status(200).json(book);
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}