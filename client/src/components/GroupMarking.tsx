import { useState } from "react";
import "./GroupMarking.css";

interface Props {
  profession: string;
  onConfirm: (cycles: string[]) => void;
  onCancel: () => void;
}

const cyclesList = ["מחזור א", "מחזור ב", "מחזור ג", "מחזור ד"];

const GroupMarking = ({ profession, onConfirm, onCancel }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCycle = (cycle: string) => {
    setSelected(prev => prev.includes(cycle) ? prev.filter(c => c !== cycle) : [...prev, cycle]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>בחירת מחזורים עבור {profession}</h2>
        <div className="cycle-buttons">
          {cyclesList.map(cycle => (
            <button
              key={cycle}
              className={selected.includes(cycle) ? "active" : ""}
              onClick={() => toggleCycle(cycle)}
            >
              {cycle}
            </button>
          ))}
        </div>
        <div className="action-buttons">
          <button onClick={() => onConfirm(selected)}>אישור</button>
          <button onClick={onCancel}>חזרה</button>
        </div>
      </div>
    </div>
  );
};

export default GroupMarking;