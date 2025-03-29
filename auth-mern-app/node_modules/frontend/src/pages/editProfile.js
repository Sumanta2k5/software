import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import Header from "./Header";
import "../Home.css";

function EditProfile() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/profile", {
                headers: { Authorization: token },
            });
            const result = await response.json();
            setUser(result);
        } catch (err) {
            handleError(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(user),
            });
            const result = await response.json();
            console.log("Response from server:", result); 
            
            if (response.ok) {
                handleSuccess("Profile updated successfully!");
                navigate("/view-profile");
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="home-container">
            <Header />
            <div className="main-content">
                <div className="profile-card">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            value={user.email}
                            disabled
                        />
                        <input
                            type="text"
                            value={user.profilePic}
                            onChange={(e) => setUser({ ...user, profilePic: e.target.value })}
                            placeholder="Profile Picture URL"
                        />

                        {/* Role-Specific Fields */}
                        {user.role === "Professor" && (
                            <>
                                <input
                                    type="text"
                                    value={user.department}
                                    onChange={(e) => setUser({ ...user, department: e.target.value })}
                                    placeholder="Department"
                                />
                                <input
                                    type="text"
                                    value={user.subjects?.join(", ")}
                                    onChange={(e) => setUser({ ...user, subjects: e.target.value.split(", ") })}
                                    placeholder="Subjects (comma-separated)"
                                />
                                <input
                                    type="text"
                                    value={user.handlePage}
                                    onChange={(e) => setUser({ ...user, handlePage: e.target.value })}
                                    placeholder="Handle Page"
                                />
                            </>
                        )}

                        {user.role === "Alumni" && (
                            <>
                                <input
                                    type="number"
                                    value={user.graduationYear}
                                    onChange={(e) => setUser({ ...user, graduationYear: e.target.value })}
                                    placeholder="Graduation Year"
                                />
                                <input
                                    type="text"
                                    value={user.currentJob}
                                    onChange={(e) => setUser({ ...user, currentJob: e.target.value })}
                                    placeholder="Current Job"
                                />
                                <input
                                    type="text"
                                    value={user.handlePage}
                                    onChange={(e) => setUser({ ...user, handlePage: e.target.value })}
                                    placeholder="Handle Page"
                                />
                            </>
                        )}

                        {user.role === "Student" && (
                            <>
                                <input
                                    type="text"
                                    value={user.department}
                                    onChange={(e) => setUser({ ...user, department: e.target.value })}
                                    placeholder="Department"
                                />
                                <input
                                    type="text"
                                    value={user.program}
                                    onChange={(e) => setUser({ ...user, program: e.target.value })}
                                    placeholder="Program"
                                />
                                <input
                                    type="number"
                                    value={user.graduationYear}
                                    onChange={(e) => setUser({ ...user, graduationYear: e.target.value })}
                                    placeholder="Graduation Year"
                                />
                            </>
                        )}

                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditProfile;
