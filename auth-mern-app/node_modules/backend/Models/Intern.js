const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Share", "Hire"],
    required: true,
  },
  topic: String,
  details: {
    type: String,
    required: true,
  },
  prerequisites: String,
  whoCanApply: String,
  applicationLink: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Change from String to ObjectId
    ref: "User",   // Changed to store user ID as a string
    required: true,
  },
  studentsApplied: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      shortMessage: String,
      cvLink: {
        type: String,
        required: true, // Ensure Google Drive link is mandatory
      },
      status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
    },
  ],
  studentsSelected: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  studentsPending: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;
