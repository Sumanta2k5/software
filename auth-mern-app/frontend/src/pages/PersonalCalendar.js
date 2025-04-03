import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendar.css";

const PersonalCalendar = () => {
  const [events, setEvents] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}/calendar-events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, [userId]);

  console.log(events);

  return (
    <div>
      <h2 className="cal_title">My Calendar</h2>
      <Calendar
        tileContent={({ date }) => {
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
        
          const event = events.find(e => {
            const startDate = new Date(e.startMonth);
            const endDate = new Date(e.endMonth);
        
            const startMonth = startDate.getMonth() + 1;
            const startYear = startDate.getFullYear();
            const endMonth = endDate.getMonth() + 1;
            const endYear = endDate.getFullYear();
        
            return (
              (year > startYear || (year === startYear && month >= startMonth)) &&
              (year < endYear || (year === endYear && month <= endMonth))
            );
          });

          return event ? (
            <div className="event-marker" data-title={event.title} style={{
              backgroundColor: event.status === "Approved" ? "red" : "yellow",
              borderRadius: "5px",
            }}></div>
          ) : null;
        }}
        tileClassName={({ date }) => {
          const today = new Date();
          if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          ) {
            return "today-date";
          }
          return null;
        }}
      />
    </div>
  );
};

export default PersonalCalendar;
