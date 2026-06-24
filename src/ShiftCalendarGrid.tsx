import React from 'react';

const ShiftCalendarGrid = ({ assignments = [], shiftDefinitions = [], profiles = [], events = [], onDayClick }: any) => {

  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  // Ensure data exists before rendering to prevent crash
  if (!Array.isArray(assignments)) {
    return <div className="loading-state">Loading calendar...</div>;
  }

  return (
    <div className="calendar-grid">
      <div className="grid-container">
        {assignments.map((day: any, dayIdx: number) => (
          <div 
            key={dayIdx} 
            className="calendar-day" 
            onClick={() => onDayClick(day)}
          >
            <div className="day-header">{day.date}</div>
            
            {/* Defensive check for shiftAssignments */}
            {Array.isArray(day.shiftAssignments) && day.shiftAssignments.map((assign: any, assignIdx: number) => {
              const shift = Array.isArray(shiftDefinitions) 
                ? shiftDefinitions.find((s: any) => s.id === assign.shiftId) 
                : null;
              const profile = Array.isArray(profiles) 
                ? profiles.find((p: any) => p.id === assign.profileId) 
                : null;
              
              return (
                <div 
                  key={assignIdx} 
                  className="assignment-pill"
                  onClick={handleStopPropagation}
                >
                  <span className="profile-name">{profile?.name || 'Unknown'}</span>
                  <span className="shift-name">{shift?.name || 'Unknown'}</span>
                  
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      handleStopPropagation(e);
                    }}
                  >
                    ×
                  </button>
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
