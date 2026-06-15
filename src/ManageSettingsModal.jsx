import React, { useState } from 'react';

const ManageSettingsModal = ({ profiles, setProfiles, shiftDefinitions, setShiftDefinitions, events, setEvents, onClose }) => {
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles', 'shifts', or 'events'
  
  // Handlers for App state
  const handleProfileChange = (id, field, value) => setProfiles(profiles.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleDeleteProfile = (id) => {
    if (profiles.length > 1) setProfiles(profiles.filter(p => p.id !== id));
    else alert("You must have at least one profile.");
  };

  const handleShiftChange = (id, field, value) => setShiftDefinitions(shiftDefinitions.map(s => s.id === id ? { ...s, [field]: value } : s));
  const handleDeleteShift = (id) => setShiftDefinitions(shiftDefinitions.filter(s => s.id !== id));
  
  const handleToggleShiftProfile = (shiftId, profileId) => {
    const shift = shiftDefinitions.find(s => s.id === shiftId);
    const newAllowed = (shift.allowedProfiles || []).includes(profileId)
      ? shift.allowedProfiles.filter(id => id !== profileId)
      : [...(shift.allowedProfiles || []), profileId];
    handleShiftChange(shiftId, 'allowedProfiles', newAllowed);
  };

  // Event Handlers
  const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));
  const handleEventPhotoUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEvents(events.map(ev => ev.id === id ? { ...ev, photo: reader.result } : ev));
      reader.readAsDataURL(file);
    }
  };

  // NEW: Function to generate a blank event template
  const handleAddNewEvent = () => {
    // Generate today's date in YYYY-MM-DD format for the default input
    const today = new Date().toISOString().split('T')[0];
    
    const newEvent = {
      id: `e${Date.now()}`,
      name: 'New Event',
      startDate: today,
      recurrenceDays: 28,
      photo: ''
    };
    
    setEvents([...events, newEvent]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <div className="settings-header">
          <h2>Manage App Data</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          <button className={`tab-btn ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>Profiles</button>
          <button className={`tab-btn ${activeTab === 'shifts' ? 'active' : ''}`} onClick={() => setActiveTab('shifts')}>Shifts</button>
          <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>Events</button>
        </div>

        <div className="settings-body">
          {activeTab === 'profiles' && (
            <div className="edit-list">
              {profiles.map(profile => (
                <div key={profile.id} className="edit-card">
                  <div className="profile-photo-wrapper">
                    {profile.photo ? <img src={profile.photo} alt={profile.name} className="profile-preview" /> : <div className="profile-placeholder" style={{ backgroundColor: profile.colour }}>{profile.name[0]}</div>}
                    <label className="upload-btn">Upload <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) { const reader = new FileReader(); reader.onloadend = () => handleProfileChange(profile.id, 'photo', reader.result); reader.readAsDataURL(file); }
                    }} hidden /></label>
                  </div>
                  <div className="edit-fields">
                    <input type="text" value={profile.name} onChange={(e) => handleProfileChange(profile.id, 'name', e.target.value)} />
                    <input type="color" value={profile.colour} onChange={(e) => handleProfileChange(profile.id, 'colour', e.target.value)} className="colour-input" />
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteProfile(profile.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shifts' && (
            <div className="edit-list">
              {shiftDefinitions.map(shift => (
                <div key={shift.id} className="edit-card">
                  <div className="edit-fields">
                    <input type="text" value={shift.name} onChange={(e) => handleShiftChange(shift.id, 'name', e.target.value)} />
                    <div className="form-row">
                      <input type="time" value={shift.startTime} onChange={(e) => handleShiftChange(shift.id, 'startTime', e.target.value)} />
                      <input type="time" value={shift.endTime} onChange={(e) => handleShiftChange(shift.id, 'endTime', e.target.value)} />
                    </div>
                    <div className="checkbox-row">
                      {profiles.map(profile => (
                        <label key={profile.id} className="profile-checkbox" style={{ fontSize: '0.8rem' }}>
                          <input type="checkbox" checked={(shift.allowedProfiles || []).includes(profile.id)} onChange={() => handleToggleShiftProfile(shift.id, profile.id)} />
                          {profile.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteShift(shift.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="edit-list">
              {events.map(ev => (
                <div key={ev.id} className="edit-card">
                  <div className="profile-photo-wrapper">
                    {ev.photo ? <img src={ev.photo} alt={ev.name} className="profile-preview" style={{ borderRadius: '4px' }} /> : <div className="profile-placeholder" style={{ backgroundColor: '#ccc', borderRadius: '4px' }}>🗓️</div>}
                    <label className="upload-btn">Icon <input type="file" accept="image/*" onChange={(e) => handleEventPhotoUpload(e, ev.id)} hidden /></label>
                  </div>
                  <div className="edit-fields">
                    <label style={{ fontSize: '0.8rem' }}>Event Name</label>
                    <input type="text" value={ev.name} onChange={(e) => setEvents(events.map(event => event.id === ev.id ? { ...event, name: e.target.value } : event))} />
                    <div className="form-row">
                       <div style={{display:'flex', flexDirection:'column'}}>
                         <label style={{ fontSize: '0.8rem' }}>Start Date</label>
                         <input type="date" value={ev.startDate} onChange={(e) => setEvents(events.map(event => event.id === ev.id ? { ...event, startDate: e.target.value } : event))} />
                       </div>
                       <div style={{display:'flex', flexDirection:'column'}}>
                         <label style={{ fontSize: '0.8rem' }}>Repeats Every (Days)</label>
                         <input type="number" value={ev.recurrenceDays} onChange={(e) => setEvents(events.map(event => event.id === ev.id ? { ...event, recurrenceDays: Number(e.target.value) } : event))} />
                       </div>
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteEvent(ev.id)}>🗑️</button>
                </div>
              ))}
              
              {/* NEW: The button to trigger the new event creation */}
              <button 
                className="add-shift-btn" 
                style={{ marginTop: '10px', alignSelf: 'flex-start' }} 
                onClick={handleAddNewEvent}
              >
                + Add New Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSettingsModal;