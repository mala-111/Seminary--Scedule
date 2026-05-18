import React, { useState, useEffect } from "react";
import "./BranchForm.css";

interface BranchHours {
  branchName: string;
  busyHours: string[];
}

interface BranchFormProps {
  username: string;
  onSave: (branches: BranchHours[]) => void;
  onClose: () => void;
}

const hoursList = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

const BranchForm: React.FC<BranchFormProps> = ({ username, onSave, onClose }) => {
  const [branchName, setBranchName] = useState("");
  const [busyHours, setBusyHours] = useState<string[]>([]);
  const [branches, setBranches] = useState<BranchHours[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`branches_${username}`);
    if (stored) setBranches(JSON.parse(stored));
  }, [username]);

  const toggleHour = (hour: string) => {
    setBusyHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const addBranch = () => {
    if (!branchName) return;
    const newBranch: BranchHours = { branchName, busyHours };
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    setBranchName("");
    setBusyHours([]);
    localStorage.setItem(`branches_${username}`, JSON.stringify(updatedBranches));
  };

  const saveAll = () => {
    onSave(branches);
    onClose();
  };

  return (
    <div className="branch-form-container">
      <h2>סניפים ושעות תפוסות למשתמש {username}</h2>

      <div className="field">
        <label>שם סניף</label>
        <input
          value={branchName}
          onChange={e => setBranchName(e.target.value)}
          placeholder="הקלד שם סניף"
        />
      </div>

      <div className="hours-selection">
        <label>סמן שעות תפוסות</label>
        <div className="hours-buttons">
          {hoursList.map(hour => (
            <button
              key={hour}
              className={busyHours.includes(hour) ? "selected" : ""}
              onClick={() => toggleHour(hour)}
            >
              {hour}
            </button>
          ))}
        </div>
      </div>

      <div className="branch-actions">
        <button onClick={addBranch}>הוסף סניף</button>
        <button onClick={saveAll}>סיום ושמירה</button>
        <button onClick={onClose}>ביטול</button>
      </div>

      {branches.length > 0 && (
        <div className="branches-list">
          <h4>סניפים קיימים:</h4>
          {branches.map((b, idx) => (
            <div key={idx}>
              <strong>{b.branchName}</strong>: {b.busyHours.join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchForm;