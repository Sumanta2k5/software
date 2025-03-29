const express = require("express");
const Notification = require("../Models/Notifications");
const router = express.Router();

// Fetch notifications for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Mark a notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
