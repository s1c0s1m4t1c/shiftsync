import React from 'react';

const ShiftCalendarGrid = ({ assignments = {}, shiftDefinitions = [], profiles = [], onDayClick }: any) => {
  
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  // Generate an array of days to display (Example: next 30 days)
  // Since you are using an object { "dateKey": [...] }, we map the keys
  const dateKeys = Object.keys(assignments);

  return (
    <div className="calendar-grid">
      <div className="grid-container">
        {dateKeys.length > 0 ? (
          dateKeys.map((dateKey: string) => {
            const dayAssignments = assignments[dateKey];
            
            return (
              <div 
                key={dateKey} 
                className="calendar-day" 
                onClick={() => onDayClick(dateKey)}
              >
                <div className="day-header">{dateKey}</div>
                
                {Array.isArray(dayAssignments) && dayAssignments.map((assign: any, assignIdx: number) => {
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
                        onClick={(e) => handleStopPropagation(e)}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="empty-state">No shifts assigned yet.</div>
        )}
      </div>
    </div>
  );
};

export default ShiftCalendarGrid;
