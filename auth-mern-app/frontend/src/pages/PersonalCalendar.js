import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendar.css"

const PersonalCalendar = () => {
  const [events, setEvents] = useState([]);
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    fetch(`/api/users/${userId}/calendar-events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, [userId]);
  console.log(events);

  const getMonthNumber = (month) => new Date(`${month} 1, 2024`).getMonth() + 1;

  return (
    <div>
      <h2 className="cal_title"> My Calendar</h2>
      <Calendar
        tileContent={({ date }) => {
          const month = date.getMonth() + 1;
          const event = events.find(e => {
            const start = getMonthNumber(e.startMonth);
            const end = getMonthNumber(e.endMonth);
            return month >= start && month <= end;
          });

          return event ? (
            <div
              style={{
                backgroundColor: event.status === "Approved" ? "red" : "yellow",
                padding: "3px",
                color: "green",
                borderRadius: "5px",
              }}
            >
              {event.title}
            </div>
          ) : null;
        }}
      />
    </div>
  );
};

export default PersonalCalendar;
