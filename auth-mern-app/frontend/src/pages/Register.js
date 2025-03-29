import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Register.css";
import logo from "../logo.png";

const departmentsList = [
  "Aerospace Engineering",
  "Research Areas",
  "Agricultural & Food Engineering",
  "Architecture & Regional Planning",
  "Biotechnology",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science & Engineering",
  "Cryogenic Engineering",
  "Electrical Engineering",
  "Electronics & Electrical Communication Engineering",
  "Geology & Geophysics",
  "Humanities & Social Sciences",
  "Mathematics",
  "Mechanical Engineering",
  "Metallurgical & Materials Engineering",
  "Mining Engineering",
  "Physics",
  "School of Bioscience",
  "School of Environmental Science and Technology",
];

const Register = () => {
  const [role, setRole] = useState(""); // Track selected role
  const [formData, setFormData] = useState({}); // Store form data
  const [department, setDepartment] = useState(""); // Track department input
  const [filteredDepartments, setFilteredDepartments] = useState([]); // For autocomplete
  const [showDropdown, setShowDropdown] = useState(false); // Show/hide department list
  const [subjects, setSubjects] = useState([]); // Store subjects
  const [subjectInput, setSubjectInput] = useState(""); // Temporary input
  const [file, setFile] = useState(null); // Store file separately
  const navigate = useNavigate(); // Redirect to Home Page

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setFormData((prev) => ({ ...prev, name: storedUser }));
    }
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ ...formData, role: selectedRole });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      finalFormData.append(key, value);
    });

    if (formData.role === "Professor") {
      subjects.forEach((subject, index) => {
        finalFormData.append(`subjects[${index}]`, subject);
      });
    }
        if (file) finalFormData.append("media", file); // Add file

    console.log("Submitted Data:", Object.fromEntries(finalFormData));

    localStorage.setItem("loggedInUser", formData.name);
    localStorage.setItem("role", role);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        body: finalFormData,
      });

      const result = await response.json();
      if (result.success) {
        alert("Registration Successful!");
        localStorage.setItem("userId", result.userId);
        navigate("/home");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Request Error:", err);
      alert("Error connecting to the server.");
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartment(value);
    setShowDropdown(true);
    setFilteredDepartments(
      departmentsList.filter((dept) =>
        dept.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFormData({ ...formData, department: value });
  };

  const selectDepartment = (dept) => {
    setDepartment(dept);
    setShowDropdown(false);
    setFormData({ ...formData, department: dept });
  };

  return (
    <div className="register-container">
      <img src={logo} alt="SCIIT Logo" className="register-logo" />
      <h1>Welcome to SCIIT</h1>
      <p>Your social platform for connecting with professors, alumni, and students.</p>
      <h1>Register as</h1>
      <div className="role-selection">
        {["Professor", "Alumni", "Student"].map((r) => (
          <button key={r} onClick={() => handleRoleSelect(r)}>
            {r}
          </button>
        ))}
      </div>

      {role && (
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register as {role}</h2>

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />

          <label>Department:</label>
          <input
            type="text"
            value={department}
            onChange={handleDepartmentChange}
            required
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && (
            <ul className="dropdown-list">
              {filteredDepartments.map((dept, index) => (
                <li key={index} onClick={() => selectDepartment(dept)}>
                  {dept}
                </li>
              ))}
            </ul>
          )}

          {role === "Professor" && (
            <>
              <label>Subjects:</label>
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Enter subject"
              />
              <button type="button" onClick={handleAddSubject}>
                Add
              </button>
              <ul>
                {subjects.map((subj, index) => (
                  <li key={index}>
                    {subj} <button type="button" onClick={() => handleRemoveSubject(index)}>❌</button>
                  </li>
                ))}
              </ul>
              <label>Handle Page:</label>
              <input type="text" name="handlePage" onChange={handleChange} required />
            </>
          )}

          {role === "Alumni" && (
            <>
              <label>Year of Graduation:</label>
              <input type="number" name="graduationYear" onChange={handleChange} required />

              <label>Current Job:</label>
              <input type="text" name="currentJob" onChange={handleChange} required />
              <label>Handle Page:</label>
              <input type="text" name="handlePage" onChange={handleChange} required />
                       
            </>
          )}

          {role === "Student" && (
            <>
              <label>Program:</label>
              <select name="program" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Dual Degree">Dual Degree</option>
                <option value="PhD">PhD</option>
                <option value="BSc">BSc</option>
              </select>

              <label>Year of Graduation:</label>
              <input type="number" name="graduationYear" onChange={handleChange} required />
              </>
          )}

          <label>Upload Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Register;
