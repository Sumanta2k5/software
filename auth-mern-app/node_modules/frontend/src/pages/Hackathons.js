import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Hackathons.css";
import Header from "./Header"; 

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [formData, setFormData] = useState({
    type: "Share",
    topic: "",
    details: "",
    whoCanApply: "",
    applicationLink: "",
    tentativeStart: "",
    tentativeEnd: "",
  });
  const [applyingHackathonId, setApplyingHackathonId] = useState(null);
  const [applicationData, setApplicationData] = useState({ shortMessage: "", cvLink: "" });
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // Fetch all hackathons
  useEffect(() => {
    fetch("http://localhost:8080/hackathons/all")
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        
        setHackathons(data)})
      .catch(error => console.error("Error fetching hackathons:", error));
  }, []);
 // console.log(hackathons);
  

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle posting a hackathon
  const handlePostHackathon = async (e) => {
    e.preventDefault();  // ✅ Prevent page refresh
    //console.log("Posting Hackathon:", formData);
    formData.postedBy = userId;

    try {
      const response = await fetch("http://localhost:8080/hackathons/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, postedBy: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to post hackathon");
      }

      const newHackathon = await response.json();
      setHackathons((prev) => [...prev, newHackathon.hackathon]);  // ✅ Update UI dynamically
      setFormData({  // ✅ Reset form fields
        type: "Share",
        topic: "",
        details: "",
        whoCanApply: "",
        applicationLink: "",
        tentativeStart: "",
        tentativeEnd: "",
      });

      alert("Hackathon posted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error posting hackathon");
    }
  };

  // Handle application submission
  const handleSubmitApplication = async () => {
    if (!applicationData.shortMessage || !applicationData.cvLink) {
      alert("Please fill in all fields before applying.");
      return;
    }

    const postData = { 
      shortMessage: applicationData.shortMessage, 
      cvLink: applicationData.cvLink, 
      userId 
    };

    try {
      const response = await fetch(`http://localhost:8080/hackathons/apply/${applyingHackathonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Application failed");
      }

      alert("Applied successfully!");
      setApplyingHackathonId(null);
    } catch (error) {
      console.error(error);
      alert("Application submission failed.");
    }
  };

  return (
    <div className="hackathon-container">
      <Header />
      <h1>Hackathons</h1>

      {/* Hackathon Posting Form */}
      <div className="post-hackathon-form">
        <h2>Post a Hackathon</h2>
        <form onSubmit={handlePostHackathon}>
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="Share">Share</option>
            <option value="Hire">Hire</option>
          </select>

          <label>Topic:</label>
          <input 
            type="text" 
            name="topic" 
            value={formData.topic} 
            onChange={handleInputChange} 
            required 
          />

          <label>Details:</label>
          <textarea 
            name="details" 
            value={formData.details} 
            onChange={handleInputChange} 
            required 
          />

          <label>Tentative Start Month:</label>
          <input 
            type="month" 
            name="tentativeStart"
            value={formData.tentativeStart} 
            onChange={handleInputChange} 
            required 
          />

          <label>Tentative End Month:</label>
          <input 
            type="month" 
            name="tentativeEnd"
            value={formData.tentativeEnd} 
            onChange={handleInputChange} 
            required 
          />

          <button type="submit">Post</button>
        </form>
      </div>

      {/* Display Hackathons */}
      <h2>Available Hackathons</h2>
      {hackathons.map((hackathon) => (
        <div key={hackathon._id} className="hackathon-card">
          <h3>{hackathon.topic}</h3>
          <p>{hackathon.details}</p>
          <p><strong>Posted by:</strong> {hackathon.postedBy.name}</p>
          <p><strong>Prerequisites:</strong> {hackathon.prerequisites || "Not specified"}</p>
          <p><strong>Who can apply:</strong> {hackathon.whoCanApply || "Not specified"}</p>
          <p><strong>Application Link:</strong> {hackathon.applicationLink || "Not specified"}</p>
          <p><strong>Tentative Start:</strong> {hackathon.tentativeStartMonth || "Not specified"}</p>
          <p><strong>Tentative End:</strong> {hackathon.tentativeEndMonth || "Not specified"}</p>

          {userRole === "Student" && (
            <button onClick={() => setApplyingHackathonId(hackathon._id)}>Apply</button>
          )}
        </div>
      ))}

      {/* Application Form */}
      {applyingHackathonId && (
        <div className="application-form">
          <h2>Apply for Hackathon</h2>
          <textarea
            placeholder="Enter a short message"
            value={applicationData.shortMessage}
            onChange={(e) => setApplicationData({ ...applicationData, shortMessage: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="CV Link"
            value={applicationData.cvLink}
            onChange={(e) => setApplicationData({ ...applicationData, cvLink: e.target.value })}
            required
          />
          <button onClick={handleSubmitApplication}>Submit Application</button>
          <button onClick={() => setApplyingHackathonId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Hackathons;
