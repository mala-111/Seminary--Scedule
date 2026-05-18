// ScheduleModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import "./ScheduleModal.css";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  setSchedules: React.Dispatch<React.SetStateAction<{ branch: string; hours: string[] }[]>>;
}

const ScheduleModal = ({ open, onClose, username, setSchedules }: ScheduleModalProps) => {
  const [branch, setBranch] = useState("");
  const [hours, setHours] = useState<string>("");

  const handleAdd = () => {
    if (!branch || !hours) {
      alert("חובה למלא סניף ושעות");
      return;
    }

    const hoursArray = hours.split(",").map(h => h.trim());
    setSchedules(prev => [...prev, { branch, hours: hoursArray }]);
    
    // Reset inputs
    setBranch("");
    setHours("");
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>הקלדת שעות לסניף</h2>
        <div className="modal-field">
          <label>סניף:</label>
          <input value={branch} onChange={e => setBranch(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>שעות (מופרדות בפסיקים):</label>
          <input value={hours} onChange={e => setHours(e.target.value)} placeholder="לדוגמה: 08:00, 09:00, 10:00" />
        </div>
        <div className="modal-buttons">
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleAdd}>
            הוסף
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={onClose}>
            סגור
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleModal;