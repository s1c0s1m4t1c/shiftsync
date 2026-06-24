import React from 'react';

const ShiftCalendarGrid = ({ year, month, assignments = {}, shiftDefinitions = [], profiles = [], events = [], onDayClick }: any) => {
  
  const handleStopPropagation = (e: any) => e.stopPropagation();

  // If assignments is undefined or null, wait to render
  if (!assignments) return <div className="loading">Loading...</div>;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-grid">
      <div className="grid-container">
        {days.map((day) => {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          // Safety: ensure assignments is an object
          const dayAssignments = (assignments && typeof assignments === 'object') ? (assignments[dateKey] || []) : [];
          const dayEvents = Array.isArray(events) ? events.filter(e => e.date === dateKey) : [];

          return (
            <div key={dateKey} className="calendar-day" onClick={() => onDayClick(dateKey)}>
              <div className="day-header">{day}</div>
              
              {dayAssignments.map((assign: any, i: number) => {
                const shift = shiftDefinitions.find((s: any) => s.id === assign.shiftId);
                const profile = profiles.find((p: any) => p.id === assign.profileId);
                return (
                  <div key={i} className="assignment-pill" style={{ backgroundColor: shift?.colour }} onClick={handleStopPropagation}>
                    {profile?.name} {shift?.name}
                    <button className="delete-btn" onClick={(e) => handleStopPropagation(e)}>×</button>
                  </div>
                );
              })}

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
