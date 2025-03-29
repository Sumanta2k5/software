import React, { useState } from "react";

const PostForm = ({ onPostCreated }) => {
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isVideo, setIsVideo] = useState(false);

    const userId = localStorage.getItem("userId");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setMedia(file);

        if (file) {
            if (file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                    setIsVideo(false); // Ensure it's recognized as an image
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith("video")) {
                const videoURL = URL.createObjectURL(file);
                setPreview(videoURL);
                setIsVideo(true);
            } else {
                setPreview(null);
                setIsVideo(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if(text!==""){
        formData.append("text", text || "");}
        formData.append("userId", userId);
        if (media) formData.append("media", media);

        const res = await fetch("http://localhost:8080/feed/post", {
            method: "POST",
            body: formData, // Don't set Content-Type; the browser sets it automatically
        });

        if (res.ok) {
            const data = await res.json();
            setText("");
            setMedia(null);
            setPreview(null);
            setIsVideo(false);
            if (onPostCreated) onPostCreated(data.post);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write something..."
            />
            
            <input type="file" onChange={handleFileChange} accept="image/*,video/*,audio/*" />
            
            {/* 🔥 Show Image or Video Preview */}
            {preview && (
                isVideo ? (
                    <video controls className="media-preview">
                        <source src={preview} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img src={preview} alt="Preview" className="media-preview" />
                )
            )}
            
            <button type="submit">Post</button>
        </form>
    );
};

export default PostForm;
