import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "./Form.css";

import ProfessionModal from "../components/ProfessionModal";
import ScheduleModal from "../components/ScheduleModal";
import DayOff from "../components/DayOff";
import EndSchedule from "../components/EndSchedule";

import { useAppDispatch, useAppSelector  } from "../redux/hooks";
import { createTeacher } from "../redux/slices/teacherSlice";
import { addHoursBooked } from "../api/hoursBookedApi";
import { assignTeacherToSubject } from "../api/teacherToSubjectApi";
import { addDaughtersTeacher } from "../api/DaughtersTeacherApi";
import { fetchAllClasses } from "../redux/slices/AllClassesSlice";



// ----------------------------
// TYPES
// ----------------------------

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
interface SelectedClass {
  id: string;
  name: string;
}
// ----------------------------

const STORAGE_KEY = "saved_user_data";

const Form = () => {
 const location = useLocation();

const navigate = useNavigate();

const dispatch = useAppDispatch();

const { allClasses } = useAppSelector(
  (state) => state.allClasses
);

const state = location.state as
  | {
      username: string;
      password: string;
    }
  | undefined;

useEffect(() => {
  dispatch(fetchAllClasses());
}, [dispatch]);

useEffect(() => {
  if (!state) {
    navigate("/");
  }
}, [state]);

const username = state?.username || "";

const password = state?.password || "";

  // ----------------------------
  // FORM STATE
  // ----------------------------

  const [formData, setFormData] = useState<FormData>({
    hours: "",
    branch: "",
    format: "",
    saved: false,
    professions: {},
  });


  // ----------------------------
  // NEW STATE
  // ----------------------------

  const [teacherData, setTeacherData] = useState({
    isGroupingTeacher: false,
  });

  // ----------------------------

  const [professionOpen, setProfessionOpen] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [dayOffOpen, setDayOffOpen] = useState(false);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  
  const [endScheduleOpen, setEndScheduleOpen] = useState(false);
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const [dayOffPriorities, setDayOffPriorities] = useState<string[]>([]);

  // ----------------------------
  // CLASSES
  // ----------------------------

const [classes, setClasses] = useState<SelectedClass[]>([]);
  const [currentClass, setCurrentClass] = useState<string>("");

  // ----------------------------
  // LOAD LOCAL STORAGE
  // ----------------------------

  useEffect(() => {
    const allData = localStorage.getItem(STORAGE_KEY);

    if (allData) {
      const parsed = JSON.parse(allData) as {
        [key: string]: FormData;
      };

      const key = `${username}_${password}`;

      if (parsed[key]) {
        setFormData({
          ...parsed[key],
          saved: true,
        });
      }
    }

    const storedSchedules = localStorage.getItem(
      `schedules_${username}_${password}`
    );

    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    }

    const tempDays = localStorage.getItem(
      `dayoff_temp_${username}_${password}`
    );

    if (tempDays) {
      setDayOffPriorities(JSON.parse(tempDays));
    }

    const tempClasses = localStorage.getItem(
      `classes_${username}_${password}`
    );

    if (tempClasses) {
      setClasses(JSON.parse(tempClasses));
    }
  }, [username, password]);

  // ----------------------------
  // CHANGE FORM
  // ----------------------------

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------
  // SAVE
  // ----------------------------

  const handleSave = async () => {
    if (
      !formData.hours ||
      !formData.format ||
      schedules.length === 0 ||
      dayOffPriorities.length !== 3
    ) {
      alert("חובה למלא את כל השדות ולבחור 3 עדיפויות ליום חופשי");

      return;
    }

    try {
      // ---------------- LOCAL STORAGE ----------------

      const allData = localStorage.getItem(STORAGE_KEY);

      const parsed = allData ? JSON.parse(allData) : {};

      const key = `${username}_${password}`;

      parsed[key] = {
        ...formData,
        saved: true,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(parsed)
      );

      localStorage.setItem(
        `schedules_${username}_${password}`,
        JSON.stringify(schedules)
      );

      localStorage.setItem(
        `dayoff_${username}_${password}`,
        JSON.stringify(dayOffPriorities)
      );

      localStorage.setItem(
        `classes_${username}_${password}`,
        JSON.stringify(classes)
      );

      localStorage.removeItem(
        `dayoff_temp_${username}_${password}`
      );

      // ---------------- DB SAVE ----------------

      const createdTeacher = await dispatch(
        createTeacher({
          name: username,

          employeeCode: password,

          weeklyHours: Number(formData.hours),
          className: formData.format === "כן" ? selectedClassId : "",

          preferredDayOffA:
            dayOffPriorities[0] || "",

          preferredDayOffB:
            dayOffPriorities[1] || "",

          preferredDayOffC:
            dayOffPriorities[2] || "",

          isClassTeacher:
            formData.format === "כן",

          isGroupingTeacher:
            teacherData.isGroupingTeacher,

        
        })
      ).unwrap();
      // שמירת כיתות הבנות
for (const cls of classes) {
  await addDaughtersTeacher({
    teacherID: createdTeacher.teacherID,
    allClassesID: cls.id,
  });
}

      if (formData.professions) {

  for (
    const [subjectName, classNames]
    of Object.entries(
      formData.professions
    )
  ) {

    for (const className of classNames) {

      await assignTeacherToSubject({
        teacherID:
          createdTeacher.teacherID,

        subjectName,

        className,
      });
    }
  }
}

      for (const schedule of schedules) {
  for (const day in schedule.hoursByDay) {
    const hours = schedule.hoursByDay[day];

    for (const hour of hours) {
      const startHour = parseInt(hour);







      await addHoursBooked({
        teacherID: createdTeacher.teacherID,
        day,
        hourStart: `${startHour}:00:00`,
        hourEnd: `${startHour + 1}:00:00`,
        reason: schedule.branch,
      });
    }
  }
}
      // ---------------- UI ----------------

      setFormData((prev) => ({
        ...prev,
        saved: true,
      }));

      alert("הפרטים נשמרו בהצלחה");
    } catch (err: any) {
  console.error("FULL ERROR:", err);

  console.error("RESPONSE:", err?.response);

  console.error("DATA:", err?.response?.data);

  alert("אירעה שגיאה בשמירה");
}
  };

  // ----------------------------
  // SCHEDULE
  // ----------------------------

  const addSchedule = (
    branch: string,
    hoursByDay: { [day: string]: string[] }
  ) => {
    setSchedules((prev) => [
      ...prev,
      { branch, hoursByDay },
    ]);
  };

  // ----------------------------
  // PROFESSIONS
  // ----------------------------

  const handleSaveProfession = (
    profession: string,
    cycles: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      professions: {
        ...prev.professions,
        [profession]: cycles,
      },
    }));
  };

  // ----------------------------
  // CLASSES
  // ----------------------------

const handleClassKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const value = currentClass.trim();

    const classRegex = /^[A-Za-zא-ת]{1,2}[0-9]{1,2}$/;

    if (!classRegex.test(value)) {
      alert(
        "כיתה לא תקינה. יש להזין 1-2 אותיות ולאחריהן 1-2 ספרות ללא רווחים"
      );
      return;
    }

    const foundClass = allClasses.find(
      c => c.className.trim().toLowerCase() === value.toLowerCase()
    );

    if (!foundClass) {
      alert("הכיתה אינה קיימת במערכת");
      return;
    }

    // בדיקה לפני השימוש ב-id
    const classId = foundClass.allClassesID;
    if (!classId) {
      alert("לכיתה אין מזהה, לא ניתן להוסיף");
      return;
    }

    if (classes.some(c => c.id === classId)) {
      alert("הכיתה כבר נוספה");
      return;
    }

    // כעת TypeScript מרוצה כי classId לעולם לא undefined
    setClasses(prev => [
      ...prev,
      { id: classId, name: foundClass.className }
    ]);

    setCurrentClass("");
  }
};

  // ----------------------------
  // JSX
  // ----------------------------

  return (
    <div className="form-page">
      <motion.div
        className={`form-card ${
          formData.saved ? "disabled" : ""
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>שלום ל-{username}</h1>

        {/* GRID */}

        <div className="form-grid">

          {/* שעות */}

          <div className="field">
            <label>מספר שעות</label>

            <input
              type="number"
              value={formData.hours}
              onChange={(e) => {
                let value = parseInt(e.target.value);

                if (value < 6) value = 6;

                if (value > 30) value = 30;

                handleChange(
                  "hours",
                  value.toString()
                );
              }}
              disabled={formData.saved}
            />
          </div>

          {/* מחנכת */}

          <div className="field">
            <label>האם מחנכת?</label>

            <div className="toggle-group">
              <button
                onClick={() =>
                  handleChange("format", "כן")
                }
                disabled={formData.saved}
                className={
                  formData.format === "כן"
                    ? "active"
                    : ""
                }
              >
                כן
              </button>

              <button
                onClick={() =>
                  handleChange("format", "לא")
                }
                disabled={formData.saved}
                className={
                  formData.format === "לא"
                    ? "active"
                    : ""
                }
              >
                לא
              </button>
            </div>

            {formData.format && (
              <span className="selection-text-inline">
                {formData.format}
              </span>

              
            )}
            {formData.format === "כן" && (
  <div className="field">
    <label>בחרי כיתה למחנכת</label>

    <select
      value={selectedClassId}
      onChange={(e) => setSelectedClassId(e.target.value)}
      disabled={formData.saved}
    >
      <option value="">בחרי כיתה</option>

      {allClasses.map((c) => (
        <option key={c.allClassesID} value={c.className}>
          {c.className}
        </option>
      ))}
    </select>
  </div>
)}
          </div>

          {/* מורת הקבצה */}

          <div className="field">
            <label>האם מורת הקבצה?</label>

            <div className="toggle-group">
              <button
                onClick={() =>
                  setTeacherData((prev) => ({
                    ...prev,
                    isGroupingTeacher: true,
                  }))
                }
                disabled={formData.saved}
                className={
                  teacherData.isGroupingTeacher
                    ? "active"
                    : ""
                }
              >
                כן
              </button>

              <button
                onClick={() =>
                  setTeacherData((prev) => ({
                    ...prev,
                    isGroupingTeacher: false,
                  }))
                }
                disabled={formData.saved}
                className={
                  !teacherData.isGroupingTeacher
                    ? "active"
                    : ""
                }
              >
                לא
              </button>
            </div>

            <span className="selection-text-inline">
              {teacherData.isGroupingTeacher
                ? "כן"
                : "לא"}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        

        <div className="action-buttons">


          <div className="button-with-text">
  <motion.button
    whileHover={{ scale: 1.06 }}
    onClick={() => setEndScheduleOpen(true)}
  >
    מערכת
  </motion.button>
</div>
{/* מקצועות */}

<div className="button-with-text">
  <motion.button
    whileHover={{ scale: 1.06 }}
    onClick={() => setProfessionOpen(true)}
    disabled={formData.saved}
  >
    מקצועות
  </motion.button>

  {/* הצגת מקצועות שנבחרו */}
  {formData.professions &&
    Object.keys(formData.professions).length > 0 && (
      <div className="sub-text">
        {Object.entries(formData.professions).map(
          ([profession, cycles]) => (
            <div key={profession}>
              <strong>{profession}:</strong>{" "}
              {cycles.join(", ")}
            </div>
          )
        )}
      </div>
    )}
</div>

        {/* שעות תפוסות */}
<div className="button-with-text">
  <motion.button
    whileHover={{ scale: 1.06 }}
    onClick={() => setScheduleOpen(true)}
    disabled={formData.saved}
  >
    הקלדת שעות תפוסות
  </motion.button>

  {/* הצגת הסניפים והשעות שנבחרו */}
  {schedules.length > 0 && (
    <div className="sub-text">
      {schedules.map((schedule, index) => (
        <div key={index}>
          <strong>{schedule.branch}:</strong>{" "}
          {Object.entries(schedule.hoursByDay).map(
  ([day, hours]) => (
    <div key={day}>
      {day}: {hours.join(", ")}
    </div>
  )
)}
        </div>
      ))}
    </div>
  )}
</div>

          {/* יום חופשי */}

          <div className="button-with-text">
            <motion.button
              whileHover={{ scale: 1.06 }}
              onClick={() =>
                setDayOffOpen(true)
              }
              disabled={formData.saved}
            >
              בחירת יום חופשי
            </motion.button>

            {dayOffPriorities.length > 0 && (
              <div className="sub-text">
                {dayOffPriorities[0] && (
                  <div>
                    עדיפות א:
                    {dayOffPriorities[0]}
                  </div>
                )}

                {dayOffPriorities[1] && (
                  <div>
                    עדיפות ב:
                    {dayOffPriorities[1]}
                  </div>
                )}

                {dayOffPriorities[2] && (
                  <div>
                    עדיפות ג:
                    {dayOffPriorities[2]}
                  </div>
                )}
              </div>
            )}
          </div>

         

          {/* כיתות */}

          <div className="button-with-text">
            <label className="classes-label">
              הקלידי את הכיתות בהן בנותיך לומדות
            </label>

            <input
              type="text"
              placeholder="הקלידי כיתה"
              value={currentClass}
              onChange={(e) =>
                setCurrentClass(e.target.value)
              }
              onKeyDown={handleClassKeyDown}
              disabled={formData.saved}
              className="classes-input"
            />

            {classes.length > 0 && (
              <div className="classes-container">
                {classes.map((c, idx) => (
                  <div
                    key={idx}
                    className="class-tag"
                  >
                    <span>{c.name}</span>

                    {!formData.saved && (
                      <button
                        type="button"
                        className="remove-class-btn"
                        onClick={() =>
                          setClasses((prev) =>
                            prev.filter(
                              (_, i) => i !== idx
                            )
                          )
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

           {/* שמירה */}

          <div className="button-with-text">
            <motion.button
              whileHover={{ scale: 1.06 }}
              onClick={handleSave}
              disabled={formData.saved}
            >
              שמירת פרטים
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* MODALS */}

      <ProfessionModal
        open={professionOpen}
        onClose={() =>
          setProfessionOpen(false)
        }
        onSaveProfession={
          handleSaveProfession
        }
      />

      <ScheduleModal
        open={scheduleOpen}
        onClose={() =>
          setScheduleOpen(false)
        }
        username={username}
        addSchedule={addSchedule}
      />

      <DayOff
        open={dayOffOpen}
        onClose={() =>
          setDayOffOpen(false)
        }
        onSaveDayOff={(days) =>
          setDayOffPriorities(days)
        }
        initialSelection={
          dayOffPriorities
        }
      />
      <EndSchedule
  open={endScheduleOpen}
  onClose={() => setEndScheduleOpen(false)}
/>
    </div>
  );
};

export default Form;