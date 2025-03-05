import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/connect.db';
import bookRoute from './routes/book.route';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet())
app.use("/api/books", bookRoute);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {    
            console.log(`http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();