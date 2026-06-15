import React from 'react';
const formatDateKey = (year: number, month: number, day: number) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

function generateCalendarGrid(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const jsDay = firstDayOfMonth.getDay(); 
  const offset = (jsDay + 6) % 7; 
  const grid = [];

  for (let i = offset - 1; i >= 0; i--) {
    grid.push({ date: daysInPrevMonth - i, isCurrentMonth: false, dateKey: formatDateKey(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, daysInPrevMonth - i) });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({ date: i, isCurrentMonth: true, dateKey: formatDateKey(year, month, i) });
  }

  const remainingCells = 42 - grid.length;
  for (let i = 1; i <= remainingCells; i++) {
    grid.push({ date: i, isCurrentMonth: false, dateKey: formatDateKey(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, i) });
  }

  return grid;
}

const ShiftCalendarGrid = ({ year, month, assignments, shiftDefinitions, profiles, events, onDayClick }: any) => {
  const gridDays = React.useMemo(() => generateCalendarGrid(year, month), [year, month]);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const todayDate = new Date();
  const todayKey = formatDateKey(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

  return (
    <div className="calendar-container">
      <div className="calendar-header-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {daysOfWeek.map(day => <div key={day} className="header-cell">{day}</div>)}
      </div>

      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {gridDays.map((dayObj: any, index: number) => {
          const dayAssignments = assignments[dayObj.dateKey] || [];
          const isToday = dayObj.dateKey === todayKey;

          const cellEvents = events.filter((ev: any) => {
            if (!ev.startDate) return false;
            const [sY, sM, sD] = ev.startDate.split('-').map(Number);
            const [tY, tM, tD] = dayObj.dateKey.split('-').map(Number);
            const start = Date.UTC(sY, sM - 1, sD);
            const target = Date.UTC(tY, tM - 1, tD);
            const diffDays = Math.round((target - start) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && (diffDays % Number(ev.recurrenceDays) === 0);
          });

          return (
            <div 
              key={index} 
              className={`grid-cell ${!dayObj.isCurrentMonth ? 'padding-day' : 'active-day'} ${isToday ? 'current-today-highlight' : ''}`}
              onClick={() => onDayClick(dayObj.dateKey)}
            >
              <div className="cell-top-bar">
                <span className="date-label">{dayObj.date}</span>
                <div className="event-icon-container">
                  {cellEvents.map((ev: any) => (
                    ev.photo ? <img key={ev.id} src={ev.photo} alt={ev.name} className="event-photo-icon" title={ev.name} /> 
                             : <span key={ev.id} className="event-text-icon" title={ev.name}>🗓️</span>
                  ))}
                </div>
              </div>
              
              <div className="shift-block-container">
                {dayAssignments.map((assign: any, assignIdx: number) => {
                  const shiftDetails = shiftDefinitions.find((s: any) => s.id === assign.shiftId);
                  const profileDetails = profiles.find((p: any) => p.id === assign.profileId);
                  
                  if (!shiftDetails || !profileDetails) return null;

                  return (
                    <div key={assignIdx} className="shift-badge" style={{ backgroundColor: shiftDetails.colour }}>
                      <div className="shift-badge-inner">
                        {profileDetails.photo ? (
                          <img src={profileDetails.photo} alt="" className="badge-avatar" />
                        ) : (
                          <span className="badge-initial" style={{ backgroundColor: profileDetails.colour }}>{profileDetails.name[0]}</span>
                        )}
                        <span className="shift-name-text">{shiftDetails.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftCalendarGrid;
