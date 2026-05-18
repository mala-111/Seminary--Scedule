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
  const [search, setSearch] = useState("");

  const filteredList = sandList.filter(p =>
    p.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>מקצועות חול</h2>
            <input
              type="text"
              placeholder="הקלד מקצוע לחיפוש..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              autoFocus
            />
            <div className="profession-list">
              {search && filteredList.map(p => (
                <button key={p} onClick={() => setSelectedProfession(p)}>
                  {p}
                </button>
              ))}
              {search && filteredList.length === 0 && <p className="no-results">לא נמצאו מקצועות</p>}
            </div>
            <button onClick={onClose} className="close-btn">חזרה</button>
          </>
        ) : (
          <GroupMarking
            profession={selectedProfession}
            onConfirm={(cycles) => {
              onSave(selectedProfession, cycles);
              setSelectedProfession(null);
              setSearch(""); // איפוס החיפוש לאחר בחירה
            }}
            onCancel={() => setSelectedProfession(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SandProfessions;