const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
require("dotenv").config();

// MongoDB Connection
const mongoURI = process.env.MONGO_CONN;
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Initialize GridFS
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("✅ GridFS Initialized");
});

// Check if GridFS is properly initialized before file handling
const getGFS = () => {
    if (!gfs) {
        throw new Error("GridFS not initialized yet. Wait for DB connection.");
    }
    return gfs;
};

// Multer Storage for GridFS
const storage = new GridFsStorage({
    url: mongoURI,
    file: async (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: "uploads",
            metadata: { uploadedBy: req.body.userId || "unknown" }, // Ensure userId is available
        };
    }
});


// Multer Upload Middleware
const upload = multer({ storage });

module.exports = { upload, getGFS };
