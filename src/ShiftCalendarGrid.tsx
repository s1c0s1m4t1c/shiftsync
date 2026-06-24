import React from 'react';

const ShiftCalendarGrid = ({ year, month, assignments = {}, shiftDefinitions = [], profiles = [], events = [], onDayClick }: any) => {
  
  const handleStopPropagation = (e: any) => e.stopPropagation();

  // 1. Generate the grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-grid">
      <div className="grid-container">
        {days.map((day) => {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          // Get assignments safely
          const dayAssignments = assignments[dateKey] || [];
          // Get events for this day
          const dayEvents = Array.isArray(events) ? events.filter(e => e.date === dateKey) : [];

          return (
            <div key={dateKey} className="calendar-day" onClick={() => onDayClick(dateKey)}>
              <div className="day-header">{day}</div>
              
              {/* Render Assignments */}
              {Array.isArray(dayAssignments) && dayAssignments.map((assign: any, i: number) => {
                const shift = shiftDefinitions.find((s: any) => s.id === assign.shiftId);
                const profile = profiles.find((p: any) => p.id === assign.profileId);
                return (
                  <div key={i} className="assignment-pill" style={{ backgroundColor: shift?.colour }} onClick={handleStopPropagation}>
                    {profile?.name} {shift?.name}
                    <button className="delete-btn" onClick={(e) => handleStopPropagation(e)}>×</button>
                  </div>
                );
              })}

              {/* Render Events */}
              {dayEvents.map((ev: any, i: number) => (
                <div key={i} className="event-pill">{ev.title}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftCalendarGrid;
