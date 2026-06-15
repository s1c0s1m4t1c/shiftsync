import { useState, useEffect, useMemo } from 'react';
import './App.css'; 
import ShiftCalendarGrid from './ShiftCalendarGrid';
import ShiftConfigurationPanel from './ShiftConfigurationPanel';
import ManageSettingsModal from './ManageSettingsModal';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddShift, setShowAddShift] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 
  const [activeShiftId, setActiveShiftId] = useState('');
  const [activeProfileId, setActiveProfileId] = useState('p1'); 
  
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('profiles');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Simon', colour: '#3b82f6', photo: '' },
      { id: 'p2', name: 'Saulé', colour: '#ec4899', photo: '' }
    ];
  });

  const [shiftDefinitions, setShiftDefinitions] = useState(() => {
    const saved = localStorage.getItem('shiftDefinitions');
    return saved ? JSON.parse(saved) : [
      { id: 's1', name: 'Day wfh', startTime: '08:00', endTime: '16:00', colour: '#4ade80', allowedProfiles: ['p1'] },
      { id: 's2', name: 'On Call', startTime: '16:00', endTime: '08:00', colour: '#ef4444', allowedProfiles: ['p1', 'p2'] }
    ];
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : {};
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('shiftDefinitions', JSON.stringify(shiftDefinitions));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('events', JSON.stringify(events));
  }, [profiles, shiftDefinitions, assignments, events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const handleAddShift = (newShift: any) => {
    setShiftDefinitions([...shiftDefinitions, newShift]);
    setActiveShiftId(newShift.id); 
    setShowAddShift(false); 
  };

  const handleDayClick = (dateKey: string) => {
    if (!activeShiftId) return;
    setAssignments((prev: any) => {
      const dayAssignments = prev[dateKey] || [];
      const existingIndex = dayAssignments.findIndex((a: any) => a.profileId === activeProfileId && a.shiftId === activeShiftId);
      let newDayAssignments = existingIndex >= 0 
        ? dayAssignments.filter((_: any, i: number) => i !== existingIndex) 
        : [...dayAssignments, { profileId: activeProfileId, shiftId: activeShiftId }];
      return { ...prev, [dateKey]: newDayAssignments };
    });
  };

  const visibleShifts = useMemo(() => {
    return shiftDefinitions.filter(shift => shift.allowedProfiles && shift.allowedProfiles.includes(activeProfileId));
  }, [shiftDefinitions, activeProfileId]);

  return (
    <div className="App">
      <div className="top-bar">
        <h1>ShiftSync Base</h1>
        <div className="header-actions">
          <button className="header-icon-btn" onClick={() => setShowSettings(true)}>⚙️ Manage</button>
          <button className="header-add-btn" onClick={() => setShowAddShift(true)}>+ Shift</button>
        </div>
      </div>

      <div className="profile-selector-container">
        <div className="profile-toggle">
          {profiles.map((profile: any) => (
            <button
              key={profile.id}
              className={`profile-tab ${activeProfileId === profile.id ? 'active' : ''}`}
              style={{ borderBottom: activeProfileId === profile.id ? `3px solid ${profile.colour}` : '3px solid transparent' }}
              onClick={() => { setActiveProfileId(profile.id); setActiveShiftId(''); }}
            >
              {profile.photo && <img src={profile.photo} alt="" className="tab-avatar" />}
              {profile.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="calendar-navigation">
        <button onClick={handlePrevMonth} className="nav-button">◀</button>
        <h2 className="month-title">{monthName} {year}</h2>
        <button onClick={handleNextMonth} className="nav-button">▶</button>
      </div>

      <ShiftCalendarGrid 
        year={year} month={month} 
        assignments={assignments} shiftDefinitions={shiftDefinitions} profiles={profiles}
        events={events}
        onDayClick={handleDayClick} 
      />

      <div className="palette-container">
        <h3>Assigning to: <span style={{ color: profiles.find((p: any) => p.id === activeProfileId)?.colour }}>{profiles.find((p: any) => p.id === activeProfileId)?.name}</span></h3>
        <div className="palette-list">
          {visibleShifts.length > 0 ? visibleShifts.map((shift: any) => (
            <button
              key={shift.id}
              className={`palette-btn ${activeShiftId === shift.id ? 'active' : ''}`}
              style={{ backgroundColor: shift.colour, border: activeShiftId === shift.id ? '3px solid #111' : '3px solid transparent' }}
              onClick={() => setActiveShiftId(shift.id)}
            >
              {shift.name}
            </button>
          )) : <p className="helper-text">No shifts configured for this profile.</p>}
        </div>
      </div>

      {showAddShift && (
        <div className="modal-overlay">
          <div className="modal-content"><ShiftConfigurationPanel profiles={profiles} onAddShift={handleAddShift} onCancel={() => setShowAddShift(false)} /></div>
        </div>
      )}

      {showSettings && (
        <ManageSettingsModal 
          profiles={profiles} setProfiles={setProfiles} 
          shiftDefinitions={shiftDefinitions} setShiftDefinitions={setShiftDefinitions} 
          events={events} setEvents={setEvents}
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}
