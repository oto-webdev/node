import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/connect.db";
import userRoute from "./routes/user.route";
import postRoute from "./routes/post.route";

config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use("/api/v1/user", userRoute);
app.use("/api/v2/post", postRoute);

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:${process.env.PORT}`);
    });
}

startServer();