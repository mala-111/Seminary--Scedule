import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./Form.css";
import ProfessionModal from "../components/ProfessionModal";
import ScheduleModal from "../components/ScheduleModal";

interface FormData {
  hours: string;
  branch: string;
  format: string;
  saved: boolean;
}

const STORAGE_KEY = "saved_user_data";

const Form = () => {
  const location = useLocation();
  const { username, password } = location.state as { username: string; password: string };

  const [formData, setFormData] = useState<FormData>({
    hours: "",
    branch: "",
    format: "",
    saved: false,
  });

  const [professionOpen, setProfessionOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedules, setSchedules] = useState<{ branch: string; hours: string[] }[]>([]);

  useEffect(() => {
    const allData = localStorage.getItem(STORAGE_KEY);
    if (allData) {
      const parsed = JSON.parse(allData) as { [key: string]: FormData };
      const key = `${username}_${password}`;
      if (parsed[key]) {
        setFormData({ ...parsed[key], saved: true });
      }
    }
  }, [username, password]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.hours || !formData.branch || !formData.format) {
      alert("חובה למלא את כל השדות");
      return;
    }
    const allData = localStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    const key = `${username}_${password}`;
    parsed[key] = { ...formData, saved: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setFormData(prev => ({ ...prev, saved: true }));
    alert("הפרטים נשמרו בהצלחה");
  };

  return (
    <div className="form-page">
      <motion.div
        className={`form-card ${formData.saved ? "disabled" : ""}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>שלום ל-{username}</h1>
        <div className="form-grid">
          <div className="field">
            <label>מספר שעות</label>
            <input
              type="number"
              value={formData.hours}
              onChange={e => {
                let value = parseInt(e.target.value);
                if (value < 6) value = 6;
                if (value > 30) value = 30;
                handleChange("hours", value.toString());
              }}
              disabled={formData.saved}
            />
          </div>
          <div className="field">
            <label>האם מחנכת?</label>
            <div className="toggle-group">
              <button
                onClick={() => handleChange("format", "כן")}
                disabled={formData.saved}
                className={formData.format === "כן" ? "active" : ""}
              >
                כן
              </button>
              <button
                onClick={() => handleChange("format", "לא")}
                disabled={formData.saved}
                className={formData.format === "לא" ? "active" : ""}
              >
                לא
              </button>
            </div>
            {formData.format && (
              <span className="selection-text-inline">{formData.format}</span>
            )}
          </div>
        </div>
        <div className="action-buttons">
          <motion.button
            whileHover={{ scale: 1.06 }}
            onClick={() => setProfessionOpen(true)}
            disabled={formData.saved}
          >
            מקצועות
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            onClick={() => setScheduleOpen(true)}
            disabled={formData.saved}
          >
            הקלדת שעות
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            onClick={handleSave}
            disabled={formData.saved}
          >
            שמירת פרטים
          </motion.button>
        </div>

        {/* הצגת כל הסניפים והשעונים שנבחרו */}
        {schedules.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {schedules.map((s, idx) => (
              <div key={idx}>
                <strong>סניף: {s.branch}</strong> - שעות תפוסות: {s.hours.join(", ")}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <ProfessionModal open={professionOpen} onClose={() => setProfessionOpen(false)} />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        branch="" // אין צורך כאן, המשתמש יקיש שם סניף בתוך ה-Modal
        setSchedules={setSchedules} // מחזיר ל-Form את כל הסניפים והשעונים
      />
    </div>
  );
};

export default Form;