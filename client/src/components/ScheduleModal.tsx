import { useState } from "react";
import "./ScheduleModal.css";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  addSchedule: (branch: string, hoursByDay: { [day: string]: string[] }) => void;
}

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const hoursList = Array.from({ length: 8 }, (_, i) => `${8 + i}:00`);

const ScheduleModal = ({ open, onClose, addSchedule }: ScheduleModalProps) => {
  const [branch, setBranch] = useState("");
  const [hoursByDay, setHoursByDay] = useState<{ [day: string]: string[] }>({});

  // Toggle שעה
  const toggleHour = (day: string, hour: string) => {
    setHoursByDay(prev => {
      const dayHours = prev[day] || [];
      if (dayHours.includes(hour)) {
        return { ...prev, [day]: dayHours.filter(h => h !== hour) };
      } else {
        return { ...prev, [day]: [...dayHours, hour] };
      }
    });
  };

  const handleAddBranch = () => {
  if (!branch) {
    alert("חובה להזין שם סניף");
    return;
  }

  if (!hasSelectedHours) {
    alert("יש לבחור לפחות שעה אחת");
    return;
  }

  addSchedule(branch, hoursByDay);
  setBranch("");
  setHoursByDay({});
};

 const handleClose = () => {
  if (branch && !hasSelectedHours) {
    alert("יש לבחור לפחות שעה אחת עבור הסניף");
    return;
  }

  if (branch && hasSelectedHours) {
    addSchedule(branch, hoursByDay);
  }

  setBranch("");
  setHoursByDay({});
  onClose();
};
  if (!open) return null;
  const hasSelectedHours =Object.values(hoursByDay).some(hours => hours.length > 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-field">
          <label>סניף</label>
          <input
            type="text"
            value={branch}
            onChange={e => setBranch(e.target.value)}
            placeholder="הזן שם סניף"
          />
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>שעה \ יום</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hoursList.map(hour => (
              <tr key={hour}>
                <td>{hour}</td>
                {days.map(day => (
                  <td
                    key={day}
                    className={hoursByDay[day]?.includes(hour) ? "selected" : ""}
                    onClick={() => toggleHour(day, hour)}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-buttons">
          <button onClick={handleAddBranch}>הוספת סניף</button>
          <button onClick={handleClose}>שמור</button>
          <button onClick={onClose}>חזרה</button>
          
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;