"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../models/book.model"));
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice, page = 1, limit = 10, search = '' } = req.query;
    try {
        let query = {};
        if (minPrice && maxPrice) {
            query.price = {
                $gte: minPrice,
                $lte: maxPrice
            };
        }
        if (search) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ] });
        }
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const books = yield book_model_1.default.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        if (!books || books.length === 0) {
            res.status(404).json({ message: "Books not found" });
            return;
        }
        const totalBooks = yield book_model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limitNumber);
        res.status(200).json({
            books,
            page: pageNumber,
            totalPages,
            totalBooks
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getBooks = getBooks;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" });
        return;
    }
    try {
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getBook = getBook;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, image } = req.body;
    if (!title || !description || !price || !image) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const book = yield book_model_1.default.create({
            title,
            description,
            price,
            image
        });
        res.status(201).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" });
        return;
    }
    try {
        const book = yield book_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "Book not found" });
        return;
    }
    try {
        const book = yield book_model_1.default.findByIdAndDelete(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteBook = deleteBook;
