import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IBook extends Document {
    title: string;
    description: string;
    price: string;  
    image: string;
}

const bookSchema = new Schema<IBook>({

        title: { 
            type: String, 
            required: true 
        },

        description: { 
            type: String, 
            required: true 
        },

        price: { 
            type: String, 
            required: true 
        },

        image: { 
            type: String, 
            required: true
        },

    }, { 
        timestamps: true 
    }
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export const validateBook = (book: Partial<IBook>) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(1000).required(),
        price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(), 
        image: Joi.string().uri().required(), 
    });

    return schema.validate(book);
};

export default Book;
