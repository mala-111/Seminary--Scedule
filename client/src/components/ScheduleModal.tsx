import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./ScheduleModal.css";




interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  addSchedule: (branch: string, hours: string[]) => void;
}

const ScheduleModal = ({ open, onClose, username, addSchedule }: ScheduleModalProps) => {
  const [branch, setBranch] = useState("");
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const hoursOptions = Array.from({ length: 25 }, (_, i) => `${i + 6}:00`); // 6:00-30:00

  const toggleHour = (hour: string) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const handleAddBranch = () => {
    if (!branch || selectedHours.length === 0) {
      alert("יש למלא סניף ולסמן לפחות שעה אחת");
      return;
    }
    addSchedule(branch, selectedHours);
    setBranch("");
    setSelectedHours([]);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-field">
          <label>שם סניף</label>
          <input
            type="text"
            placeholder="הקלד שם סניף"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          />
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>שעות</th>
            </tr>
          </thead>
          <tbody>
            {hoursOptions.map(hour => (
              <tr key={hour}>
                <td
                  className={selectedHours.includes(hour) ? "selected" : ""}
                  onClick={() => toggleHour(hour)}
                >
                  {hour}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-buttons">
          <button onClick={handleAddBranch}>הוסף סניף</button>
          <button onClick={onClose}>סגור</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;