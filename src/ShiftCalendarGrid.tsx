import React from 'react';

const ShiftCalendarGrid = ({ year, month, assignments = {}, shiftDefinitions = [], profiles = [], onDayClick }: any) => {
  
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  // Generate an array of days for the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-grid">
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {daysArray.map((dayNum) => {
          // Format the date key to match your app's storage format (e.g., "2026-06-24")
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayAssignments = assignments[dateKey] || [];

          return (
            <div 
              key={dateKey} 
              className="calendar-day" 
              onClick={() => onDayClick(dateKey)}
              style={{ border: '1px solid #ccc', minHeight: '80px', padding: '5px' }}
            >
              <div className="day-header">{dayNum}</div>
              
              {dayAssignments.map((assign: any, assignIdx: number) => {
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
                    style={{ backgroundColor: shift?.colour || '#ddd', fontSize: '10px', marginTop: '2px' }}
                  >
                    {profile?.name} - {shift?.name}
                    <button onClick={(e) => handleStopPropagation(e)}>×</button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftCalendarGrid;
