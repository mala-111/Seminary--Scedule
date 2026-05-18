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

interface Schedule {
  branch: string;
  hoursByDay: { [day: string]: string[] };
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // טעינת נתוני טופס וסניפים
  useEffect(() => {
    const allData = localStorage.getItem(STORAGE_KEY);
    if (allData) {
      const parsed = JSON.parse(allData) as { [key: string]: FormData };
      const key = `${username}_${password}`;
      if (parsed[key]) {
        setFormData({ ...parsed[key], saved: true });
      }
    }

    // טעינת סניפים לפי שם+סיסמה
    const storedSchedules = localStorage.getItem(`schedules_${username}_${password}`);
    if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
  }, [username, password]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.hours || !formData.format || schedules.length === 0) {
      alert("חובה למלא את כל השדות");
      return;
    }

    const allData = localStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    const key = `${username}_${password}`;
    parsed[key] = { ...formData, saved: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    // שמירה לפי שם + סיסמה
    localStorage.setItem(`schedules_${username}_${password}`, JSON.stringify(schedules));

    setFormData(prev => ({ ...prev, saved: true }));
    alert("הפרטים נשמרו בהצלחה");
  };

  const addSchedule = (branch: string, hoursByDay: { [day: string]: string[] }) => {
    setSchedules(prev => [...prev, { branch, hoursByDay }]);
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
            {formData.format && <span className="selection-text-inline">{formData.format}</span>}
          </div>
        </div>

        <div className="action-buttons">
          <motion.button whileHover={{ scale: 1.06 }} onClick={() => setProfessionOpen(true)} disabled={formData.saved}>
            מקצועות
          </motion.button>
          <motion.button whileHover={{ scale: 1.06 }} onClick={() => setScheduleOpen(true)} disabled={formData.saved}>
            הקלדת שעות תפוסות
          </motion.button>
          <motion.button whileHover={{ scale: 1.06 }} onClick={handleSave} disabled={formData.saved}>
            שמירת פרטים
          </motion.button>
        </div>

        {schedules.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {schedules.map((s, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <strong>סניף: {s.branch}</strong>
                <div>
                  {Object.entries(s.hoursByDay).map(([day, hours]) => (
                    <div key={day}>
                      יום {day}: {hours.join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <ProfessionModal open={professionOpen} onClose={() => setProfessionOpen(false)} />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        username={username}
        addSchedule={addSchedule}
      />
    </div>
  );
};

export default Form;