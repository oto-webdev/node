import mongoose from "mongoose";

interface IPost extends mongoose.Document {
    title: string;
    user: mongoose.Schema.Types.ObjectId;
}

const postSchema: mongoose.Schema<IPost> = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, {
    timestamps: true,
});

export const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
