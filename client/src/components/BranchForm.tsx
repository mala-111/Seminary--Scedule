// BranchForm.tsx
import React, { useState } from 'react';

interface BranchHours {
  branchName: string;
  busyHours: string[];
}

interface UserBranches {
  [username: string]: BranchHours[];
}

const BranchForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [branchName, setBranchName] = useState('');
  const [busyHours, setBusyHours] = useState<string[]>([]);
  const [tempBranches, setTempBranches] = useState<BranchHours[]>([]);
  const [allBranches, setAllBranches] = useState<UserBranches>({});
  const [showAddAnother, setShowAddAnother] = useState(false);

  const handleAddBranch = () => {
    if (!branchName) return;
    const newBranch: BranchHours = { branchName, busyHours };
    setTempBranches([...tempBranches, newBranch]);
    setBranchName('');
    setBusyHours([]);
    setShowAddAnother(true); // שואל אם רוצים להוסיף סניף נוסף
  };

  const handleUserDecision = (addAnother: boolean) => {
    if (addAnother) {
      setBranchName('');
      setBusyHours([]);
      setShowAddAnother(false);
    } else {
      handleSaveUserBranches();
      setShowAddAnother(false);
    }
  };

  const handleSaveUserBranches = () => {
    if (!username) return;
    const existing = allBranches[username] || [];
    setAllBranches({ ...allBranches, [username]: [...existing, ...tempBranches] });
    setTempBranches([]);
  };

  const toggleHour = (hour: string) => {
    if (busyHours.includes(hour)) {
      setBusyHours(busyHours.filter(h => h !== hour));
    } else {
      setBusyHours([...busyHours, hour]);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '400px' }}>
      <h3>שם משתמש</h3>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="שם משתמש" />

      <h3>סניף</h3>
      <input value={branchName} onChange={e => setBranchName(e.target.value)} placeholder="הקלד שם סניף" />

      <h4>סמן שעות תפוסות</h4>
      <div>
        {['9:00', '10:00', '11:00', '12:00'].map(hour => (
          <button
            key={hour}
            style={{
              margin: '0.2rem',
              backgroundColor: busyHours.includes(hour) ? 'red' : 'green',
              color: 'white'
            }}
            onClick={() => toggleHour(hour)}
          >
            {hour}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleAddBranch}>הוסף סניף</button>
      </div>

      {showAddAnother && (
        <div style={{ marginTop: '1rem' }}>
          <p>האם אתה עובד בסניף נוסף?</p>
          <button onClick={() => handleUserDecision(true)}>כן</button>
          <button onClick={() => handleUserDecision(false)}>לא</button>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h4>סניפים זמניים</h4>
        {tempBranches.map((b, idx) => (
          <div key={idx}>
            {b.branchName}: {b.busyHours.join(', ')}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>סניפים שנשמרו למשתמש {username}</h4>
        {(allBranches[username] || []).map((b, idx) => (
          <div key={idx}>
            {b.branchName}: {b.busyHours.join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchForm;