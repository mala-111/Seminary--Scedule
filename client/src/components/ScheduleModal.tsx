import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./ScheduleModal.css";
import BranchForm from './BranchForm';

function ScheduleModelPage() {
  return (
    <div>
      <h1>דף לוח זמנים</h1>
      <BranchForm />
    </div>
  );
}

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  branch?: string;
  onSave: (branch: string, hours: string[]) => void;
}

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

const ScheduleModal = ({ open, onClose, branch, onSave }: ScheduleModalProps) => {
  const [selectedCells, setSelectedCells] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!open) setSelectedCells({});
  }, [open]);

  const toggleCell = (day: string, hour: string) => {
    const key = `${day}_${hour}`;
    setSelectedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (!branch) return;
    const selectedHours = Object.keys(selectedCells).filter(k => selectedCells[k]);
    onSave(branch, selectedHours);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2>הקלדת שעות תפוסות - {branch}</h2>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>שעה / יום</th>
              {days.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour}>
                <td>{hour}</td>
                {days.map(day => {
                  const key = `${day}_${hour}`;
                  return (
                    <td
                      key={key}
                      className={selectedCells[key] ? "selected" : ""}
                      onClick={() => toggleCell(day, hour)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions">
          <button onClick={onClose}>חזרה</button>
          <button onClick={handleSave}>שמירה</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleModal;