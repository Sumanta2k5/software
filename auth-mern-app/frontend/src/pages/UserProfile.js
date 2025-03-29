import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError } from '../utils';
import Header from './Header';
import '../Profile.css';

function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div className="home-container">
            <Header />
            <div className="main-content">
                {user ? ( // ✅ Check if user is not null before rendering profile
                    <div className="profile-card">
                        <img
                            src={user.profilePic || 'default-profile.jpg'}
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
                        <img src={post.mediaUrl} alt="Post media" className="post-image" />
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

            </div>
            <ToastContainer />
        </div>
    );
}

export default UserProfile;
