import React from 'react';

const ShiftCalendarGrid = ({ assignments, shiftDefinitions, profiles, events, onDayClick }: any) => {

  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className="calendar-grid">
      {/* Calendar Header/Days Logic Here */}
      <div className="grid-container">
        {assignments.map((day: any, dayIdx: number) => (
          <div 
            key={dayIdx} 
            className="calendar-day" 
            onClick={() => onDayClick(day)}
          >
            <div className="day-header">{day.date}</div>
            
            {/* Example of interactive element inside a day cell */}
            {day.shiftAssignments?.map((assign: any, assignIdx: number) => {
              const shift = shiftDefinitions.find((s: any) => s.id === assign.shiftId);
              const profile = profiles.find((p: any) => p.id === assign.profileId);
              
              return (
                <div 
                  key={assignIdx} 
                  className="assignment-pill"
                  onClick={handleStopPropagation} // Prevents triggering day modal
                >
                  <span className="profile-name">{profile?.name}</span>
                  <span className="shift-name">{shift?.name}</span>
                  
                  {/* If you have a delete/edit button, also apply stopPropagation */}
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      handleStopPropagation(e);
                      // Add your delete logic here
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
