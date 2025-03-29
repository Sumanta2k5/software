const express = require("express");
const router = express.Router();
const Hackathon = require("../Models/Hack");
const User = require("../Models/User");

// Post a Hackathon (Prof/Alumni/Student)
router.post("/post", async (req, res) => {
  try {
    const { type, topic, details, prerequisites, whoCanApply, applicationLink, postedBy,tentativeStart,tentativeEnd} = req.body;

    if (!postedBy) return res.status(400).json({ error: "User ID is required" });

    const newHackathon = new Hackathon({
      type,
      topic,
      details,
      prerequisites:prerequisites || "",
      whoCanApply:whoCanApply || "",
      applicationLink:applicationLink || "",
      postedBy,
      tentativeStartMonth:tentativeStart,
      tentativeEndMonth:tentativeEnd,
      studentsApplied: [],
      studentsSelected: [],
      studentsPending: [],
    });

    await newHackathon.save();
    res.status(201).json({ message: "Hackathon created successfully", hackathon: newHackathon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Hackathons
router.get("/all", async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate("postedBy", "name email") // Populate user details
      .populate("studentsApplied.student", "name email") 
      .populate("studentsSelected", "name email") 
      .populate("studentsPending", "name email");

    //console.log("Fetched Hackathons:", hackathons); // Debugging
    res.json(hackathons);
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    res.status(500).json({ error: error.message });
  }
});


// Apply to a Hackathon (Only Students)
router.post("/apply/:id", async (req, res) => {
  try {
    const { shortMessage, cvLink, userId } = req.body;
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!cvLink) return res.status(400).json({ message: "CV link is required" });

    const newApplication = { 
      student: userId, 
      shortMessage: shortMessage || "",  
      cvLink: cvLink,             
      status: "Pending"
    };

    hackathon.studentsApplied.push(newApplication);
    hackathon.studentsPending.push(userId);

    await hackathon.save();  
    res.json({ message: "Applied successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve a student (Prof/Alumni)
router.put("/approve/:hackathonId/:studentId", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    const studentIndex = hackathon.studentsApplied.findIndex(s => s.student.toString() === req.params.studentId);
    if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });

    hackathon.studentsApplied[studentIndex].status = "Approved";
    hackathon.studentsSelected.push(req.params.studentId);
    hackathon.studentsPending = hackathon.studentsPending.filter(s => s.toString() !== req.params.studentId);

    await hackathon.save();
    res.json({ message: "Student approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
