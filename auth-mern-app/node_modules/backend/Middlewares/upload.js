const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        console.log("Uploading file:", file.mimetype); // 🔍 Log file type

        return {
            folder: "user_posts",
            resource_type: "auto", // Make sure it's auto
            allowed_formats: ["jpg", "jpeg", "png", "mp4", "mp3", "wav"],
        };
    }
});

const upload = multer({ storage });

module.exports = upload;
