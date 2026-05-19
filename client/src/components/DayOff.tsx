import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DayOffProps {
  open: boolean;
  onClose: () => void;
  onSaveDayOff: (days: string[]) => void;
  initialSelection?: string[];
}

const allDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
const colors = ["#f87171", "#34d399", "#facc15"]; // אדום, ירוק, צהוב
const labels = ["עדיפות א", "עדיפות ב", "עדיפות ג"];

const DayOff = ({ open, onClose, onSaveDayOff, initialSelection = [] }: DayOffProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDays(initialSelection);
  }, [open, initialSelection]);

  const handleDayClick = (day: string) => {
    const index = selectedDays.indexOf(day);

    if (index !== -1) {
      // ביטול בחירה
      const newSelection = [...selectedDays];
      newSelection[index] = ""; // משאיר ריק במקומו
      setSelectedDays(newSelection);
    } else {
      // הוספה במיקום הראשון הפנוי (הריק) אם קיים, אחרת בסוף
      const emptyIndex = selectedDays.indexOf("");
      if (emptyIndex !== -1) {
        const newSelection = [...selectedDays];
        newSelection[emptyIndex] = day;
        setSelectedDays(newSelection);
      } else if (selectedDays.length < 3) {
        setSelectedDays([...selectedDays, day]);
      }
    }
  };

  const handleSave = () => {
    if (selectedDays.length !== 3 || selectedDays.includes("")) {
      alert("חובה לסמן 3 עדיפויות");
      return;
    }
    onSaveDayOff(selectedDays);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <motion.div
        className="dayoff-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          minWidth: "300px"
        }}
      >
        <h2>בחירת יום חופשי (חובה לסמן 3 עדיפויות)</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          {allDays.map((day) => {
            const idx = selectedDays.indexOf(day);
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "10px",
                  background: idx !== -1 ? colors[idx] : "#e5e7eb",
                  color: idx !== -1 ? "white" : "black",
                  display: "flex",
                  justifyContent: "space-between",
                  transition: "background 0.2s, color 0.2s"
                }}
              >
                <span>{day}</span>
                {idx !== -1 && <small>{labels[idx]}</small>}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "30px",
            justifyContent: "flex-end"
          }}
        >
          <button
            onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "10px" }}
          >
            חזרה
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "#3b82f6",
              color: "white"
            }}
          >
            שמור
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DayOff;