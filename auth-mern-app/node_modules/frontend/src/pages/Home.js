import React, { useEffect, useState } from 'react';
import { handleError } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../Home.css";
import Header from "./Header"; 
import { Link } from 'react-router-dom';
import PostForm from "./PostForm";


function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [profilePic, setProfilePic] = useState(''); // State to store profile picture URL
    const [posts, setPosts] = useState([]); 
    const [likedPost, setLikedPost] = useState(new Set()); 
    const [showLikes, setShowLikes] = useState(null);
    const [showComments, setShowComments] = useState(null);
    const userId = localStorage.getItem("userId");
    console.log(userId);

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchUserProfile(); // Fetch profile picture on component mount
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`);
            const data = await response.json();
            console.log(data);
            if (data.profilePic) {
                setProfilePic(data.profilePic); // Set the profile picture URL
            }
        } catch (err) {
            handleError(err);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:8080/feed/all");
            const data = await response.json();
    
            if (Array.isArray(data)) {
                setPosts(data);
                setLikedPost(new Set(data.filter(post => post.likes.some(like => like._id === userId)).map(post => post._id)));
            }
        } catch (err) {
            handleError(err);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8080/feed/${postId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId }), 
            });

            const data = await response.json();
            if (response.ok) {
                fetchPosts(); // Refresh posts after like
            } else {
                handleError(data.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleComment = async (postId, commentText) => {
        try {
            const response = await fetch(`http://localhost:8080/feed/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
                body: JSON.stringify({ userId, text: commentText }),
            });

            const data = await response.json();
            if (response.ok) {
                fetchPosts(); // Refresh posts after comment
            } else {
                handleError(data.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div>
            <Header />

            <div className="home1-container">
                <div className="left-sidebar">
                    <div className="profile-card">
                        {/* Show the profile picture if it exists */}
                        <img 
                            src={profilePic || "default-profile.jpg"} 
                            alt="Profile" 
                            className="profile-pic" 
                        />
                        <h3>{loggedInUser}</h3>
                        <p>Details</p>
                        <Link to="/view-profile">
                            <button>View Profile</button>
                        </Link>
                    </div>
                </div>

                <div className="main-content">
                    <PostForm onPostSubmit={fetchPosts} />

                    {posts.map((post) => (
                        <div key={post._id} className="post">
                            <img
                                src={post.userId?.profilePic || "default-profile.jpg"}
                                alt="Profile"
                                className="profile-pic"
                            />
                            <Link className="links" to={`/profile/${post.userId?._id}`}>
                            <h4>{post.userId?.name || "Unknown User"}</h4>
                            </Link>
                            <p>{post.text}</p>
                            {post.mediaUrl && (
                                post.mediaUrl.endsWith(".mp4") ? (
                                    <video controls className="post-media">
                                        <source src={post.mediaUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={post.mediaUrl} alt="Post media" className="post-media" />
                                )
                            )}
                                                        <p>{new Date(post.createdAt).toLocaleDateString()}</p>


                            <div className="post-actions">
                                <button className= "btn btn-primary"
                                    onClick={() => handleLike(post._id)}
                                    disabled={post.likes.some(like => like._id === userId)}
                                    //style={{ backgroundColor: post.likes.some(like => like._id === userId) ? "gray" : "blue" }}
                                >
                                    👍 {post.likes.some(like => like._id === userId) ? "Liked" : "Like"} ({post.likes.length || 0})
                                </button>

                                <button className= "btn btn-secondary" onClick={() => setShowLikes(showLikes === post._id ? null : post._id)}>👥 View Likes</button>

                                {showLikes === post._id && (
                                    <ul className="likes-list">
                                        {post.likes.map(like => (
                                            <li key={like._id}>{like.name}</li>
                                        ))}
                                    </ul>
                                )}

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && e.target.value.trim()) {
                                                handleComment(post._id, e.target.value);
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                    <button onClick={() => setShowComments(showComments === post._id ? null : post._id)}>
                                        💬 {post.comments.length} Comments
                                    </button>

                                    {showComments === post._id && (
                                        <ul className="comments-list">
                                            {post.comments.map((comment, index) => (
                                                <li key={index}>
                                                    <strong>{comment.userId.name}</strong>: {comment.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home;
