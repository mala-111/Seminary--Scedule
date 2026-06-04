// GradeModal.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchClasses,
  createClass,
  deleteClass,
} from "../redux/slices/ClassSlice"; // שם הסלייס החדש
import "./GradeModal.css";

interface GradeModalProps {
  open: boolean;
  onClose: () => void;
}

const GradeModal = ({ open, onClose }: GradeModalProps) => {
  const dispatch = useAppDispatch();
  const { classes } = useAppSelector((state) => state.classes);

  const [name, setName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (open) dispatch(fetchClasses());
  }, [open, dispatch]);

  // פילטר למחיקה עם השלמה אוטומטית
  const filteredGrades = classes.filter((g) =>
    g.name.toLowerCase().includes(deleteName.toLowerCase())
  );

  const handleAdd = async () => {
    if (!name.trim()) return;

    // בדיקה אם המחזור כבר קיים
    if (classes.some((g) => g.name.trim().toUpperCase() === name.trim().toUpperCase())) {
      alert("מחזור זה כבר קיים");
      return;
    }

    await dispatch(createClass({ name }));
    alert("המחזור נוסף בהצלחה");
    setName("");
  };

  const handleDelete = async (gradeName: string) => {
    const exists = classes.find(
      (g) => g.name.trim().toLowerCase() === gradeName.trim().toLowerCase()
    );

    if (!exists) {
      alert("מחזור לא קיים");
      return;
    }

    await dispatch(deleteClass(exists.classID!));
    alert("המחזור נמחק בהצלחה");
    setDeleteName("");
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        <h2>ניהול מחזורים</h2>

        {/* הוספה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלד מחזור חדש"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleAdd}>הוסף מחזור</button>
        </div>

        {/* מחיקה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלד שם מחזור למחיקה"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />

          {deleteName && (
            <div className="suggestions">
              {filteredGrades.map((g) => (
                <div
                  key={g.classID}
                  className="suggestion-item"
                  onClick={() => setDeleteName(g.name)}
                >
                  {g.name}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => handleDelete(deleteName)}>מחק מחזור</button>
        </div>

        {/* הצגת כל המחזורים */}
        <div className="section">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "הסתר את כל המחזורים" : "הצג את כל המחזורים"}
          </button>
          {showAll && (
            <ul className="all-items-list">
              {classes.map((g) => (
                <li key={g.classID}>{g.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeModal;