const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String},
    mediaUrl: { type: String }, // Stores Cloudinary URL
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
