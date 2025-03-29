const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String, enum: ["Professor", "Alumni", "Student"]},
    profilePic: { type: String },
    
    // Role-specific fields
    department: { type: String },
    subjects: [{ type: String }],  // Only for Professors
    handlePage: { type: String },  // For Professors and Alumni
    graduationYear: { type: Number },  // For Students & Alumni
    currentJob: { type: String },  // For Alumni
    program: { type: String, enum: ["B.Tech", "M.Tech", "Dual Degree", "PhD", "BSc"] } , // Only for Students
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] , // Store post IDs
    appliedEvents: [
        {
            title: String,       // Internship or Hackathon title
            status: String,      // "Pending" or "Approved"
            startMonth: String, 
            endMonth: String
        }
      ]

})
    


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;