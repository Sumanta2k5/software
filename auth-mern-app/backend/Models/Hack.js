const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
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
  tentativeStartMonth: {
    type: String,
    required: true,
  },
  tentativeEndMonth: {
    type: String,
    required: true,
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" , // Ensure ref is set

    required: true,
  },
  studentsApplied: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      shortMessage: String,
      cvLink: {
        type: String,
        required: true,
      },
      status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
    },
  ],
  studentsSelected: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  studentsPending: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Hackathon = mongoose.model("Hackathon", hackathonSchema);
module.exports = Hackathon;
