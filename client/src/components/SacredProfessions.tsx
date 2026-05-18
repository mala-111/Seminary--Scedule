import { useState } from "react";
import "./SacredProfessions.css";
import GroupMarking from "./GroupMarking";

interface Props {
  onClose: () => void;
  onSave: (profession: string, cycles: string[]) => void;
}

const sacredList = [
  "תנ\"ך",
  "תורה עיון",
  "תורה בקיאות",
  "סוגיות בתנך",
  "הלכה",
  "יהדות",
  "הלכות שבת",
  "מסילת ישרים",
  "תפילה",
  "שירה",
  "חסידות",
  "מוסר",
  "חגים ומועדים",
  "לישרים תהילה",
  "ספר החינוך"
];

const SacredProfessions = ({ onClose, onSave }: Props) => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>מקצועות קודש</h2>
            <div className="profession-list">
              {sacredList.map(p => (
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
              setSelectedProfession(null);
            }}
            onCancel={() => setSelectedProfession(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SacredProfessions;