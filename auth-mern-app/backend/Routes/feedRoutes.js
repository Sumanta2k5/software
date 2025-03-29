const express = require("express");
const Post = require("../Models/Post");
const upload = require("../Middlewares/upload");
const cloudinary = require("../cloudinary");
const ensureAuthenticated = require("../Middlewares/Auth");
const router = express.Router();

// 🟢 CREATE A NEW POST (WITH MEDIA UPLOAD)
router.post("/post", upload.single("media"), async (req, res) => {
    try {
        console.log("Request body:", req.body); // 🔍 Log the incoming body

        const { text, userId } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID is required" });
        //if (!text) return res.status(400).json({ error: "Text is required" });

        let mediaUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
            });
            mediaUrl = result.secure_url;
        }

        const newPost = new Post({ text:text?.trim() || null, mediaUrl, userId: userId, likes: [], comments: [], shares: [] });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;

// 🟢 GET ALL POSTS
router.get("/all", async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", "name profilePic").populate("likes","name").sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// 🟢 LIKE A POST
router.post("/:id/like", async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        }

        await post.save();
        res.json({ message: "Post liked/unliked", likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Error liking post", error });
    }
});

// 🟢 ADD A COMMENT
router.post("/:id/comment",async (req, res) => {
    try {
        const { userId, text } = req.body;
        const post = await Post.findById(req.params.id);

        post.comments.push({ userId, text });
        await post.save();

        res.json({ message: "Comment added", comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
});
router.get("/user-posts", ensureAuthenticated,async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from token
        //console.log("User ID:", req.user._id);
        const posts = await Post.find({ userId }).sort({ createdAt: -1 }); // Fetch user's posts
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user posts" });
    }
});

module.exports = router;
