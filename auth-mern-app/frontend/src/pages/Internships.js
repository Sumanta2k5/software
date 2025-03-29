import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../Internship.css";
import Header from "./Header"; // Import Header
import axios from 'axios';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState({ type: "Share", topic: "", details: "", whoCanApply: "", applicationLink: "" });
  const [applyingInternshipId, setApplyingInternshipId] = useState(null);
  const [applicationData, setApplicationData] = useState({ shortMessage: "", cvLink: "" });
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch filtered internships when search term changes
  useEffect(() => {
    if (searchTerm.length > 1) {
        axios.get(`http://localhost:8080/api/interns/searchIntern?query=${searchTerm}`)
            .then(response => setSearchResults(response.data))
            .catch(error => console.error("Error fetching search results:", error));
    } else {
        setSearchResults([]);
    }
}, [searchTerm]);

  
  useEffect(() => {
    fetch("http://localhost:8080/interns/all")
      .then(res => res.json())
      .then(data => setInternships(data));
  }, []);

  const handleApplyClick = (internshipId) => {
    setApplyingInternshipId(internshipId);
    setApplicationData({ shortMessage: "", cvLink: "" });
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.shortMessage || !applicationData.cvLink) {
      alert("Please fill in all fields before applying.");
      return;
    }

    const postData = {
      shortMessage: applicationData.shortMessage,
      cvLink: applicationData.cvLink,
      userId: userId
    };

    const response = await fetch(`http://localhost:8080/interns/apply/${applyingInternshipId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      alert("Applied successfully!");
      setApplyingInternshipId(null);

      setInternships((prevInternships) =>
        prevInternships.map((intern) =>
          intern._id === applyingInternshipId
            ? { ...intern, studentsApplied: [...intern.studentsApplied, { student: { _id: userId }, status: "Pending" }] }
            : intern
        )
      );
    } else {
      alert("Application failed");
    }
  };

  const handleApprove = async (internshipId, studentId) => {
    await fetch(`http://localhost:8080/interns/approve/${internshipId}/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    alert("Student Approved");

    setInternships((prevInternships) =>
      prevInternships.map((intern) =>
        intern._id === internshipId
          ? {
              ...intern,
              studentsApplied: intern.studentsApplied.map((student) =>
                student.student._id === studentId ? { ...student, status: "Approved" } : student
              ),
            }
          : intern
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { ...formData, postedBy: userId };

    try {
      const response = await fetch("http://localhost:8080/interns/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Internship posted successfully!");
        navigate(0);
      } else {
        alert("Failed to post internship.");
      }
    } catch (error) {
      console.error("Error posting internship:", error);
    }
  };

  // 🔥 Separate applied and available internships
  const appliedInternships = internships.filter((intern) =>
    intern.studentsApplied.some((student) => student.student._id === userId)
  );
  const availableInternships = internships.filter(
    (intern) => !intern.studentsApplied.some((student) => student.student._id === userId)
  );
  const postedInternships = internships.filter((intern) => intern.postedBy._id === userId);

  return (
    <div>
      {/* ✅ Search Box */}
      <div className="searching">
      <div className="search-box1">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Display Results */}
        {loading && <p>Loading...</p>}

{searchResults.length > 0 ? (
  <div className="search-results">
    {searchResults.map((intern) => (
      <div key={intern._id} className="internship-card">
        <h3>{intern.topic}</h3>
        <p>{intern.details}</p>
        {intern.prerequisites && <p><strong>Prerequisites:</strong> {intern.prerequisites}</p>}
        {intern.whoCanApply && <p><strong>Who Can Apply:</strong> {intern.whoCanApply}</p>}
        <p><strong>Posted by:</strong> {intern.postedBy?.name || "Unknown"}</p>

        {/* ✅ Check if user has already applied */}
        {appliedInternships.some(applied => applied._id === intern._id) ? (
          appliedInternships.map((applied) => (
            applied._id === intern._id && (
              <div key={applied._id}>
                <p><strong>Status:</strong> 
                  {applied.studentsApplied.find((student) => student.student._id === userId)?.status === "Approved"
                    ? " Approved ✅"
                    : " Yet to be approved ⏳"}
                </p>
                <button disabled>Applied</button>
              </div>
            )
          ))
        ) : (
          // ✅ If not applied, show application form or apply button
          userRole === "Student" && (
            applyingInternshipId === intern._id ? (
              <div className="application-form">
                <label>Short Message:</label>
                <textarea
                  value={applicationData.shortMessage}
                  onChange={(e) => setApplicationData({ ...applicationData, shortMessage: e.target.value })}
                  required
                />

                <label>Google Drive Link to CV:</label>
                <input
                  type="text"
                  placeholder="Enter Google Drive link to your CV"
                  value={applicationData.cvLink}
                  onChange={(e) => setApplicationData({ ...applicationData, cvLink: e.target.value })}
                  required
                />

                <button onClick={handleSubmitApplication}>Apply</button>
              </div>
            ) : (
              <button onClick={() => handleApplyClick(intern._id)}>Apply</button>
            )
          )
        )}
      </div>
    ))}
  </div>
) : (
  searchTerm && !loading && <p>No results found.</p>
)}

        </div>
         <div className="home-container">
      <Header/>
        <div className="internship-container">
      <h1>Internships</h1>


      {userRole === "Professor" || userRole === "Alumni" ? (
        <div>
          <h2>Post an Internship</h2>
          <form onSubmit={handleSubmit}>
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="Share">Share</option>
              <option value="Hire">Hire</option>
            </select>
            {formData.type === "Hire" && (
              <>
                <label>Topic:</label>
                <input type="text" name="topic" value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} required />
                <label>Who Can Apply:</label>
                <input type="text" name="whoCanApply" value={formData.whoCanApply} onChange={e => setFormData({ ...formData, whoCanApply: e.target.value })} required />
              </>
            )}
            <label>Details:</label>
            <textarea name="details" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} required />
            <label>Application Link:</label>
            <input type="text" name="applicationLink" value={formData.applicationLink} onChange={e => setFormData({ ...formData, applicationLink: e.target.value })} required />
            <button type="submit">Post</button>
          </form>
        </div>
      ) : null}

      {userRole === "Student" && appliedInternships.length > 0 && (
        <>
          <h2>Applied Internships</h2>
          {appliedInternships.map((intern) => (
            <div key={intern._id} className="internship-card">
              <h3>{intern.topic}</h3>
              <p>{intern.details}</p>
              <p><strong>Posted by:</strong> {intern.postedBy?.name}</p>
              <p><strong>Status:</strong> 
                {intern.studentsApplied.find((student) => student.student._id === userId).status === "Approved" ? 
                  " Approved ✅" : " Yet to be approved ⏳"}
              </p>
              <button disabled>Applied</button>
            </div>
          ))}
        </>
      )}
      {(userRole === "Professor" || userRole==="Alumni")&& postedInternships.length > 0 && (    
        <>
        <h2>Posted Internships</h2>
        {postedInternships.map((intern) => (
          <div key={intern._id} className="internship-card">
            <h3>{intern.topic}</h3>
            <p>{intern.details}</p>
            <p><strong>Posted by:</strong> {intern.postedBy?.name}</p>
            {intern.studentsApplied.length > 0 && (
              <>
            <h4>Applicants:</h4>
            {intern.studentsApplied.map((student) => (
            
              <div key={student.student._id}>
                <p>{student.student.name}</p>
                <p><strong>CV:</strong> <a href={student.cvLink} target="_blank" rel="noopener noreferrer">View CV</a></p>
                {student.status === "Approved" ? (
                  <button disabled>Approved</button>
                ) : (
                  <button onClick={() => handleApprove(intern._id, student.student._id)}>Approve</button>
                )}
              </div>
            ))}
            </>
            
          )}
          </div>
        ))} 
        </>
        )}

      <h2>Available Internships</h2>
      
      {availableInternships.map((intern) => (
        <div key={intern._id} className="internship-card">
          <h3>{intern.topic}</h3>
          <p>{intern.details}</p>
          <p><strong>Posted by:</strong> {intern.postedBy?.name}</p>

          {userRole === "Student" && (
            applyingInternshipId === intern._id ? (
              <div className="application-form">
                <label>Short Message:</label>
                <textarea
                  value={applicationData.shortMessage}
                  onChange={(e) => setApplicationData({ ...applicationData, shortMessage: e.target.value })}
                  required
                />

                <label>Google Drive Link to CV:</label>
                <input
                  type="text"
                  placeholder="Enter Google Drive link to your CV"
                  value={applicationData.cvLink}
                  onChange={(e) => setApplicationData({ ...applicationData, cvLink: e.target.value })}
                  required
                />

                <button onClick={handleSubmitApplication}>Apply</button>
              </div>
            ) : (
              <button onClick={() => handleApplyClick(intern._id)}>Apply</button>
            )
          )}

          {(userRole === "Professor" || userRole==="Alumni") && (
            postedInternships.map((intern) => (
            <div>
              {intern.studentsApplied.length > 0 && (
                <>
              <h4>Applicants:</h4>
              {intern.studentsApplied.map((student) => (
                <div key={student.student._id}>
                  <p>{student.student.name}</p>
                  <p><strong>CV:</strong> <a href={student.cvLink} target="_blank" rel="noopener noreferrer">View CV</a></p>
                  {student.status === "Approved" ? (
                    <button disabled>Approved</button>
                  ) : (
                    <button onClick={() => handleApprove(intern._id, student.student._id)}>Approve</button>
                  )}
                </div>
              ))}
              </>
              )}
            </div>
          )))}
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

export default Internships;
