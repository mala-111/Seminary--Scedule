import { useState } from "react";
import "./SandProfessions.css";
import GroupMarking from "./GroupMarking";

interface Props {
  onClose: () => void;
  onSave: (profession: string, cycles: string[]) => void;
}

const sandList = [
  "פיזיקה",
  "כימיה",
  "ביולוגיה",
  "מדעים",
  "ספרות",
  "היסטוריה",
  "גאוגרפיה",
  "אמנות",
  "מוסיקה",
  "התעמלות",
  "מחשבים",
  "כלכלה",
  "מדעי החברה",
  "פסיכולוגיה",
  "מדעי הסביבה",
  "עיצוב גרפי",
  "רובוטיקה",
  "אזרחות",
  "תקשורת",
  "לשון והבעה",
  "תחביר",
  "דקדוק"
];

const SandProfessions = ({ onClose, onSave }: Props) => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>מקצועות חול</h2>
            <div className="profession-list">
              {sandList.map(p => (
                <button key={p} onClick={() => setSelectedProfession(p)}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={onClose}>חזרה</button>
          </>
        ) : (
          <GroupMarking
            profession={selectedProfession}
            onConfirm={(cycles) => {
              onSave(selectedProfession, cycles);
              setSelectedProfession(null); // חזרה לרשימת מקצועות
            }}
            onCancel={() => setSelectedProfession(null)} // חזרה לרשימת מקצועות
          />
        )}
      </div>
    </div>
  );
};

export default SandProfessions;