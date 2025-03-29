const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Post = require('../Models/Post');
const e = require('express');

// Search users by name
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        // Case-insensitive search for users
        const users = await User.find({ name: { $regex: query, $options: 'i' } })
                               .select('name profilePic role'); // Send only necessary fields

        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Example route to fetch user details
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            name: user.name,
            profilePic: user.profilePic, // Send profilePic URL
            role: user.role,
            email:user.email,
            department:user.department  || "",
            graduationYear:user.graduationYear  || "",
            currentJob:user.currentJob  || "",
            program:user.program || "",
            subjects:user.subjects || [],
            handlePage:user.handlePage || "",

            // other user fields
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get("/:id/posts", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);
module.exports = router;
