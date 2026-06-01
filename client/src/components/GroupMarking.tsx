import { useState } from "react";
import "./GroupMarking.css";
import { useEffect } from "react";

import { useAppDispatch } from "../redux/hooks";
import { useAppSelector } from "../redux/hooks";

import { fetchClasses } from "../redux/slices/ClassSlice";


interface Props {
  profession: string;
  onConfirm: (cycles: string[]) => void;
  onCancel: () => void;
}


const GroupMarking = ({ profession, onConfirm, onCancel }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCycle = (cycle: string) => {
    setSelected(prev => prev.includes(cycle) ? prev.filter(c => c !== cycle) : [...prev, cycle]);
  };

  const dispatch = useAppDispatch();

const { classes } = useAppSelector(
  (state) => state.classes
);
useEffect(() => {
  dispatch(fetchClasses());
}, [dispatch]);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>בחירת מחזורים עבור {profession}</h2>
        <div className="cycle-buttons">
          {classes.map((c) => (
            <button
  key={c.classID}
  className={
    selected.includes(c.name)
      ? "active"
      : ""
  }
  onClick={() =>
    toggleCycle(c.name)
  }
>
  {c.name}
</button>
          ))}
        </div>
        {selected.length === 0 && (
  <p>יש לבחור לפחות כיתה אחת</p>
)}
        <div className="action-buttons">
          <button onClick={() => onConfirm(selected)} disabled={selected.length === 0}>אישור</button>
          <button onClick={onCancel}>חזרה</button>
        </div>
      </div>
    </div>
  );
};

export default GroupMarking;