import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./Form.css";
import ProfessionModal from "../components/ProfessionModal";
import ScheduleModal from "../components/ScheduleModal";
import DayOff from "../components/DayOff";

// הגדרת מבנה הנתונים של הטופס
interface FormData {
  hours: string;
  branch: string;
  format: string;
  saved: boolean;
  professions?: { [profession: string]: string[] };
}

interface Schedule {
  branch: string;
  hoursByDay: { [day: string]: string[] };
}

// מפתח שמירה ב-localStorage
const STORAGE_KEY = "saved_user_data";

const Form = () => {
  const location = useLocation();
  const { username, password } = location.state as { username: string; password: string };

  // ----------------------------
  // STATES לניהול הטופס
  // ----------------------------
  const [formData, setFormData] = useState<FormData>({
    hours: "",
    branch: "",
    format: "",
    saved: false,
    professions: {},
  });

  const [professionOpen, setProfessionOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [dayOffOpen, setDayOffOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [dayOffPriorities, setDayOffPriorities] = useState<string[]>([]);

  // ----------------------------
  // STATE ורשימת כיתות הבנות
  // ----------------------------
  const [classes, setClasses] = useState<string[]>([]); // רשימת כיתות
  const [currentClass, setCurrentClass] = useState<string>(""); // הקלט הנוכחי

  // ----------------------------
  // טעינת נתונים מ-localStorage
  // ----------------------------
  useEffect(() => {
    const allData = localStorage.getItem(STORAGE_KEY);
    if (allData) {
      const parsed = JSON.parse(allData) as { [key: string]: FormData };
      const key = `${username}_${password}`;
      if (parsed[key]) setFormData({ ...parsed[key], saved: true });
    }

    const storedSchedules = localStorage.getItem(`schedules_${username}_${password}`);
    if (storedSchedules) setSchedules(JSON.parse(storedSchedules));

    const tempDays = localStorage.getItem(`dayoff_temp_${username}_${password}`);
    if (tempDays) setDayOffPriorities(JSON.parse(tempDays));

    const tempClasses = localStorage.getItem(`classes_${username}_${password}`);
    if (tempClasses) setClasses(JSON.parse(tempClasses));
  }, [username, password]);

  // ----------------------------
  // פונקציות לטיפול בשדות הטופס
  // ----------------------------
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.hours || !formData.format || schedules.length === 0 || dayOffPriorities.length !== 3) {
      alert("חובה למלא את כל השדות ולבחור 3 עדיפויות ליום חופשי");
      return;
    }

    const allData = localStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    const key = `${username}_${password}`;
    parsed[key] = { ...formData, saved: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    localStorage.setItem(`schedules_${username}_${password}`, JSON.stringify(schedules));
    localStorage.setItem(`dayoff_${username}_${password}`, JSON.stringify(dayOffPriorities));
    localStorage.setItem(`classes_${username}_${password}`, JSON.stringify(classes));
    localStorage.removeItem(`dayoff_temp_${username}_${password}`);
    setFormData(prev => ({ ...prev, saved: true }));
    alert("הפרטים נשמרו בהצלחה");
  };

  const addSchedule = (branch: string, hoursByDay: { [day: string]: string[] }) => {
    setSchedules(prev => [...prev, { branch, hoursByDay }]);
  };

  const handleSaveProfession = (profession: string, cycles: string[]) => {
    setFormData(prev => ({
      ...prev,
      professions: { ...prev.professions, [profession]: cycles },
    }));
  };

  // ----------------------------
  // פונקציה להוספת כיתה בלחיצה על ENTER
  // ----------------------------
const handleClassKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const value = currentClass.trim();

    // חובה:
    // 1-2 אותיות בעברית/אנגלית
    // לאחר מכן 1-2 ספרות
    // ללא רווחים או תווים נוספים
    const classRegex = /^[A-Za-zא-ת]{1,2}[0-9]{1,2}$/;

    if (!classRegex.test(value)) {
      alert(
        "כיתה לא תקינה. יש להזין 1-2 אותיות ולאחריהן 1-2 ספרות ללא רווחים"
      );
      return;
    }

    if (!classes.includes(value)) {
      setClasses(prev => [...prev, value]);
    }

    setCurrentClass("");
  }
};

  // ----------------------------
  // JSX של הדף
  // ----------------------------
  return (
    <div className="form-page">
      <motion.div
        className={`form-card ${formData.saved ? "disabled" : ""}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>שלום ל-{username}</h1>

        {/* ---------------------------- */}
        {/* שעות ומחנכת */}
        {/* ---------------------------- */}
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

        {/* ---------------------------- */}
        {/* כפתורים - מקצועות, שעות תפוסות, יום חופשי, כיתות */}
        {/* ---------------------------- */}
       <div className="action-buttons">
  {/* כל כפתור ומידע קשור נארז יחד */}
  <div className="button-with-text">
    <motion.button
      whileHover={{ scale: 1.06 }}
      onClick={() => setProfessionOpen(true)}
      disabled={formData.saved}
    >
      מקצועות
    </motion.button>
    {/* הצגת מקצועות מתחת לכפתור */}
    {formData.professions && Object.keys(formData.professions).length > 0 && (
      <div className="sub-text">
        {Object.entries(formData.professions).map(([p, cycles]) => (
          <div key={p}>
            <strong>{p}:</strong> {cycles.join(", ")}
          </div>
        ))}
      </div>
    )}
  </div>

  <div className="button-with-text">
    <motion.button
      whileHover={{ scale: 1.06 }}
      onClick={() => setScheduleOpen(true)}
      disabled={formData.saved}
    >
      הקלדת שעות תפוסות
    </motion.button>
    {/* הצגת סניפים ושעות מתחת לכפתור */}
    {schedules.length > 0 && (
      <div className="sub-text">
        {schedules.map((s, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <strong>סניף: {s.branch}</strong>
            {Object.entries(s.hoursByDay).map(([day, hours]) => (
              <div key={day}>יום {day}: {hours.join(", ")}</div>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>

  <div className="button-with-text">
    <motion.button
      whileHover={{ scale: 1.06 }}
      onClick={() => setDayOffOpen(true)}
      disabled={formData.saved}
    >
      בחירת יום חופשי
    </motion.button>
    {/* הצגת ימים חופשיים מתחת לכפתור */}
    {dayOffPriorities.length > 0 && (
      <div className="sub-text">
        {dayOffPriorities[0] && <div>עדיפות א: {dayOffPriorities[0]}</div>}
        {dayOffPriorities[1] && <div>עדיפות ב: {dayOffPriorities[1]}</div>}
        {dayOffPriorities[2] && <div>עדיפות ג: {dayOffPriorities[2]}</div>}
      </div>
    )}
  </div>

  <div className="button-with-text">
    <motion.button
      whileHover={{ scale: 1.06 }}
      onClick={handleSave}
      disabled={formData.saved}
    >
      שמירת פרטים
    </motion.button>
  </div>

  <div className="button-with-text">
  <label className="classes-label">
    הקלידי את הכיתות בהן בנותיך לומדות (לחצי ENTER בין כיתה לכיתה)
  </label>

  <input
    type="text"
    placeholder="הקלידי כיתה"
    value={currentClass}
    onChange={e => setCurrentClass(e.target.value)}
    onKeyDown={handleClassKeyDown}
    disabled={formData.saved}
    className="classes-input"
  />

  {classes.length > 0 && (
    <div className="classes-container">
      {classes.map((c, idx) => (
        <div key={idx} className="class-tag">
          <span>{c}</span>

          {!formData.saved && (
            <button
              type="button"
              className="remove-class-btn"
              onClick={() =>
                setClasses(prev => prev.filter((_, i) => i !== idx))
              }
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</div>
</div>
      </motion.div>

      {/* ---------------------------- */}
      {/* מודלים חיצוניים */}
      {/* ---------------------------- */}
      <ProfessionModal
        open={professionOpen}
        onClose={() => setProfessionOpen(false)}
        onSaveProfession={handleSaveProfession}
      />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        username={username}
        addSchedule={addSchedule}
      />
      <DayOff
        open={dayOffOpen}
        onClose={() => setDayOffOpen(false)}
        onSaveDayOff={(days) => setDayOffPriorities(days)}
        initialSelection={dayOffPriorities}
      />
    </div>
  );
};

export default Form;