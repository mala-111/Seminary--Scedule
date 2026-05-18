import { useState } from "react";
import "./GroupsProfessions.css";
import GroupMarking from "./GroupMarking";

interface Props {
  onClose: () => void;
  onSave: (profession: string, cycles: string[]) => void;
}

const groupsList = ["אנגלית", "מתמטיקה", "דקדוק"];

const GroupsProfessions = ({ onClose, onSave }: Props) => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>הקבצות</h2>
            <div className="profession-list">
              {groupsList.map(p => (
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

export default GroupsProfessions;