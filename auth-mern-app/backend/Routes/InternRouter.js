const express = require("express");
const router = express.Router();
const Intern = require("../Models/Intern");
const User=require("../Models/User");
const Notification = require("../Models/Notifications");
const mongoose = require("mongoose");
const { object } = require("joi");



// Post an internship (Prof/Alumni)
router.post("/post", async (req, res) => {
  try {
    const { type, topic, details, prerequisites, whoCanApply, applicationLink, postedBy } = req.body;

    if (!postedBy) return res.status(400).json({ error: "User ID is required" });

    const newInternship = new Intern({
      type,
      topic,
      details,
      prerequisites,
      whoCanApply,
      applicationLink,
      postedBy,
      studentsApplied: [],
      studentsSelected: [],
      studentsPending: [],
    });

    await newInternship.save();
    res.status(201).json({ message: "Internship created successfully", internship: newInternship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all internships
router.get("/all", async (req, res) => {
  try {
    const internships = await Intern.find()
      .populate("postedBy", "name")
      .populate("studentsApplied.student", "name email");

    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply to an internship (Students)
router.post("/apply/:id", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { shortMessage, cvLink, userId } = req.body;
    const internship = await Intern.findById(req.params.id);
    console.log("Internship:", internship);

    if (!internship) return res.status(404).json({ message: "Internship not found" });
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!cvLink) return res.status(404).json({ message: "cvLink not found" });

    const mongoose = require("mongoose");

    objectIdUser = userId;

    /*internship.studentsApplied.push({ student: objectIdUser, shortMessage:shortMessage, cvLink :cvLink || ""});
    internship.studentsPending.push(objectIdUser); 

    await internship.save();
    res.json({ message: "Applied successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
console.log("Applying User ID:", objectIdUser);
console.log("CV Link Before Saving:", cvLink);
console.log("Short Message Before Saving:", shortMessage);

// 🔴 Explicitly check cvLink and shortMessage before pushing
const newApplication = { 
  student: objectIdUser, 
  shortMessage: shortMessage || "",  // Ensure not null
  cvLink: cvLink || "",              // Ensure not null
  status: "Pending"
};

console.log("New Application Object:", newApplication);

internship.studentsApplied.push(newApplication);
internship.studentsPending.push(objectIdUser);

//console.log("Final Internship Data Before Save:", JSON.stringify(internship, null, 2));

await internship.save();  
//res.json({ message: "Applied successfully" });

const applicant = await User.findById(objectIdUser);
console.log("Applicant:", applicant);
    if (!applicant) return res.status(404).json({ error: "User not found" });

    const notification = new Notification({
      userId: internship.postedBy._id, // Notify the poster
      message: `${applicant.name} applied for your internship: ${internship.topic}`,
      type: "internship_application",
    });
    await notification.save();
    res.json({ message: "Applied successfully, notification sent" });



} catch (error) {
console.error("Error:", error);
res.status(500).json({ error: error.message });
}
});

// Approve a student (Prof/Alumni)
router.put("/approve/:internshipId/:studentId", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const internship = await Intern.findById(req.params.internshipId);
    const applierId = req.params.studentId;
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    const studentIndex = internship.studentsApplied.findIndex(s => s.student.toString() === req.params.studentId);
    if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });

    internship.studentsApplied[studentIndex].status = "Approved";
    internship.studentsSelected.push(req.params.studentId);
    internship.studentsPending = internship.studentsPending.filter(s => s.toString() !== req.params.studentId);

    await internship.save();
    const notification = new Notification({
      userId: applierId,
      message: `Your application for ${internship.topic} was approved by ${internship.postedBy.name}!`,
      type: "internship_approval",
    });
    await notification.save();
    res.json({ message: "Student approved successfully,notification sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
