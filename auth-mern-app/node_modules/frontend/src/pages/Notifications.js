import React, { useEffect, useState } from "react";
import "../Notifications.css";
import Header from "./Header";
import background from "../bg2.jpg"

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8080/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8080/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) return <p className="notifications-title">Loading notifications...</p>;

  return (
    <div>
    <Header/>
    <div className="notifications-wrapper">
    <div className="notifications-container">
      <h2 className="notifications-title">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="notifications-title">No notifications yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`notification-item ${notif.isRead ? "read" : "unread"}`}
            >
              <p className="notification-message">{notif.message}</p>
              <small className="notification-timestamp">
                {new Date(notif.timestamp).toLocaleString()}
              </small>
              {!notif.isRead && (
                <button className="mark-read-btn" onClick={() => markAsRead(notif._id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
    </div>
  );
};

export default Notifications;
