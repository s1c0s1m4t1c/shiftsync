import { useState } from 'react';

const ManageSettingsModal = ({ profiles, setProfiles, shiftDefinitions, setShiftDefinitions, events, setEvents, onClose }: any) => {
  
  const handlePhotoUpload = (profileId: string, e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            setProfiles((prev: any) => prev.map((p: any) => 
              p.id === profileId ? { ...p, photo: resizedDataUrl } : p
            ));
        }
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Manage Settings</h2>
        
        <h3>Profiles</h3>
        {profiles.map((p: any) => (
          <div key={p.id} className="settings-row">
            <span>{p.name}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handlePhotoUpload(p.id, e)} 
            />
            {p.photo && <img src={p.photo} alt="Preview" style={{ width: '40px', borderRadius: '50%' }} />}
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageSettingsModal;
