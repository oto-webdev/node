import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected To MongoDB!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;