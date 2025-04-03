import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError } from '../utils';
import Header from './Header';
import '../userProfile.css';

function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [hackathons, setHackathons] = useState([]);

    useEffect(() => {
        fetchProfile();
        fetchUserPosts();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const result = await response.json();
            setUser(result);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${userId}/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch posts');
            const result = await response.json();
            setUserPosts(result);
        } catch (err) {
            handleError(err);
        }
    };
    useEffect(() => {
            fetch("http://localhost:8080/interns/all")
              .then(res => res.json())
              .then(data => setInternships(data));
          }, []);
    console.log(internships);
    
    const postedInternships = internships.filter((intern) => intern.postedBy._id === user._id);
     useEffect(() => {
            fetch("http://localhost:8080/hackathons/all")
              .then(res => res.json())
              .then(data => setHackathons(data));
          }, []);
    
    const postedHackathons = hackathons.filter((hack) => hack.postedBy._id === userId);
console.log(postedHackathons);
console.log(postedInternships);
console.log(user);
    return (
        <div className="home-container4">
            <Header />
            <div className="main-content">
                {user ? ( // ✅ Check if user is not null before rendering profile
                    <div className="profile-card">
                        <img
                            src={user.profilePic || '/default-profile.jpg'}
                            alt="Profile"
                            className="profile-pic"
                        />
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        {(user.role === 'Professor' || user.role === 'Alumni') && (
                            <p>Department: {user.department}</p>
                        )}
                        {user.role === 'Professor' && <p>Subjects: {user.subjects.join(', ')}</p>}
                        {user.role === 'Alumni' && <p>Graduation Year: {user.graduationYear}</p>}
                        {user.role === 'Alumni' && <p>Current Job: {user.currentJob}</p>}
                        {user.role === 'Student' && <p>Program: {user.program}</p>}
                        {(user.role === 'Professor' || user.role==='Alumni') && <a href={user.handlePage}>Visit Handle Page</a>}
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}

<div className="profile-posts">
    <h2>Posts</h2>
    {userPosts.length > 0 ? (
        userPosts.map((post) => (
            <div key={post._id} className="post-card">
                {/* Check if mediaUrl exists */}
                {post.mediaUrl && (
                    post.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img src={post.mediaUrl } alt="Post media" className="post-image" />
                    ) : (
                        <video controls className="post-video">
                            <source src={post.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )
                )}
                <p>{post.text}</p>
                <p><strong>Likes:</strong> {post.likes.length}</p>
                <p><strong>Comments:</strong> {post.comments.length}</p>
                <p><strong>Shares:</strong> {post.shares.length}</p>
                <p><small>Posted on: {new Date(post.createdAt).toLocaleString()}</small></p>
            </div>
        ))
    ) : (
        <p>No posts to display</p>
    )}
</div>
{user?(
<div className="profile-internships">
         
            {(user.role==="Professor"  || user.role==="Alumni")&& (
               <>
                    <h2>Posted Internships</h2>
                    {postedInternships.length > 0 ? (
                        postedInternships.map((internship) => (
                            <div key={internship._id} className="internship-card">
                                <h3>{internship.topic}</h3>
                                <p>{internship.details}</p>
                                <p><strong>Posted by:</strong> {internship.postedBy.name}</p>
                                <p><strong>Applications:</strong> {internship.studentsApplied.length}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posted internships</p>
                    )}
              </>
            )}
            
            
            
</div>
            
):(
    <p>Loading profile...</p>
)}

{user?(
<div className="profile-hackathons">
    {(user.role==="Professor"  || user.role==="Alumni")&& (
               <>
                    <h2>Posted Hackathons</h2>
                    {postedHackathons.length > 0 ? (
                        postedHackathons.map((hackathon) => (
                            <div key={hackathon._id} className="hackathon-card">
                                <h3>{hackathon.topic}</h3>
                                <p>{hackathon.details}</p>
                                <p><strong>Posted by:</strong> {hackathon.postedBy.name}</p>
                                <p><strong>Applications:</strong> {hackathon.studentsApplied.length}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posted hackathons</p>
                    )}
              </>
            )}
            </div>
):(
    <p>Loading profile...</p>
)}


            </div>
            <ToastContainer />
        </div>
    );
}

export default UserProfile;
