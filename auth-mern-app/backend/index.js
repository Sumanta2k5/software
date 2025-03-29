const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

// Import Routes
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const RegRouter = require('./Routes/RegRouter');
const InternRouter = require('./Routes/InternRouter');
const HackathonRouter = require('./Routes/HackathonRouter');
const ProfileRouter = require('./Routes/profile');
const userRouter = require('./Routes/userRoutes');
const searchInternRouter = require('./Routes/searchIntern');
const feedRoutes = require('./Routes/feedRoutes');
const NotificationRouter = require('./Routes/notificationRoutes');
const { upload } = require('./fileUpload'); // Import Multer config
require('./Models/db'); // Database connection

// Port
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // ✅ Handles FormData


// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/register', RegRouter);
app.use('/interns', InternRouter);
app.use('/hackathons', HackathonRouter);
app.use('/profile', ProfileRouter);
app.use('/api/users', userRouter);
app.use('/api/interns', searchInternRouter);
app.use('/feed', feedRoutes);
app.use('/notifications', NotificationRouter);

// 🆕 Move file upload to `feedRoutes.js`, remove from index.js

// Ping Route
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
