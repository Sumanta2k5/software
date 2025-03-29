const express = require("express");
const bcrypt = require("bcrypt");
const { regValidation } = require("../Middlewares/RegValidation");
const User = require("../Models/User");
const cloudinary = require("../cloudinary");
const router = express.Router();
const upload = require("../Middlewares/upload");

// Register or Update User Route
router.post("/", upload.single("media"), regValidation, async (req, res) => {
    try {
        //console.log("Uploaded file:", req.file); // Log the uploaded file

       const { name, email, role, department,
            subjects, handlePage, graduationYear, currentJob, program } = req.body;

        // Check if user exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            // Update user details in the same User collection
           // let profilePic = existingUser.profilePic;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "auto",
                });
                existingUser.profilePic = result.secure_url;
            }
            if (name) existingUser.name = name;
            if (role) existingUser.role = role;
            if (department) existingUser.department = department;
            if (subjects) existingUser.subjects = subjects;
            if (handlePage) existingUser.handlePage = handlePage;
            if (graduationYear) existingUser.graduationYear = graduationYear;
            if (currentJob) existingUser.currentJob = currentJob;
            if (program) existingUser.program = program;

            await existingUser.save();
            return res.status(200).json({ success: true, message: "User details updated successfully", userId: existingUser._id });
        }
    } catch (error) {
        console.error("Error Details:", error.message, error.stack);
res.status(500).json({ message: error.message });
}
});

module.exports = router;
