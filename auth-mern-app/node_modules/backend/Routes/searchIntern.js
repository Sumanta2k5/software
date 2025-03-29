const express = require("express");
const router = express.Router();
const Intern = require("../Models/Intern"); // Import Intern model

// ✅ Search internships by details, prerequisites, or whoCanApply
router.get("/searchIntern", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]); // Return empty if no query is provided

    // Case-insensitive search for internships
    const internships = await Intern.find({
      $or: [
        { topic: { $regex: query, $options: "i" } },
        { details: { $regex: query, $options: "i" } },
        { prerequisites: { $regex: query, $options: "i" } },
        { whoCanApply: { $regex: query, $options: "i" } },
      ],
    }).select("topic details postedBy") // Send only necessary fields
      .populate("postedBy", "name"); // Populate postedBy with name only

    res.json(internships);
  } catch (error) {
    console.error("Error searching internships:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
