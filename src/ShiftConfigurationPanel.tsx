import { useState } from 'react';

const ShiftConfigurationPanel = ({ profiles, onAddShift, onCancel }: any) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [colour, setColour] = useState('#3b82f6');
  
  // State to track which profiles are allowed to use this shift
  const [allowedProfiles, setAllowedProfiles] = useState(profiles.map((p: any) => p.id));

  const handleToggleProfile = (profileId: any) => {
    setAllowedProfiles((prev: any) => 
      prev.includes(profileId) 
        ? prev.filter((id: any) => id !== profileId) 
        : [...prev, profileId]
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!name.trim() || allowedProfiles.length === 0) return;

    const newShift = {
      id: `s${Date.now()}`, 
      name, 
      startTime, 
      endTime, 
      colour, 
      allowedProfiles
    };

    onAddShift(newShift);
  };

  return (
    <div className="config-panel">
      <h3>Create New Shift</h3>
      <form onSubmit={handleSubmit} className="shift-form">
        <div className="form-group">
          <label>Shift Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g., Night Shift"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Shift Colour</label>
          <div className="colour-picker-row">
            <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} className="colour-input" />
            <span className="hex-display">{colour}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Available For:</label>
          <div className="checkbox-row">
            {profiles.map((profile: any) => (
              <label key={profile.id} className="profile-checkbox">
                <input 
                  type="checkbox" 
                  checked={allowedProfiles.includes(profile.id)} 
                  onChange={() => handleToggleProfile(profile.id)} 
                />
                {profile.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="add-shift-btn">Save Shift</button>
        </div>
      </form>
    </div>
  );
};

export default ShiftConfigurationPanel;
