import React from 'react';

const ShiftCalendarGrid = ({ assignments, shiftDefinitions, profiles, events, onDayClick }: any) => {
  
  // Minimal safety check: if assignments is missing, treat as empty object
  const safeAssignments = assignments || {};

  return (
    <div className="calendar-grid">
      <div className="grid-container">
        {Object.keys(safeAssignments).map((dateKey) => (
          <div 
            key={dateKey} 
            className="calendar-day" 
            onClick={() => onDayClick(dateKey)}
          >
            <div className="day-header">{dateKey}</div>
            
            {safeAssignments[dateKey] && safeAssignments[dateKey].map((assign: any, i: number) => {
              const shift = shiftDefinitions.find((s: any) => s.id === assign.shiftId);
              const profile = profiles.find((p: any) => p.id === assign.profileId);
              
              return (
                <div key={i} className="assignment-pill">
                  {profile?.name} {shift?.name}
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); }}>×</button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftCalendarGrid;
