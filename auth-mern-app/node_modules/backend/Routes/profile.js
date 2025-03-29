const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const authMiddleware = require("../Middlewares/Auth");

// GET Profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select("-password -__v");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Profile
router.put("/", authMiddleware, async (req, res) => {
    try {
        const { name, profilePic, department, subjects, handlePage, graduationYear, currentJob, program } = req.body;

        const updateFields = { name, profilePic };
        if (req.user.role === "Professor") Object.assign(updateFields, { department, subjects, handlePage });
        if (req.user.role === "Alumni") Object.assign(updateFields, { graduationYear, currentJob, handlePage });
        if (req.user.role === "Student") Object.assign(updateFields, { department, program, graduationYear });

        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: updateFields },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 