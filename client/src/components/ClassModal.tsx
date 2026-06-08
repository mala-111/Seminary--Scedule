import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {fetchAllClasses,createAllClass,deleteClass ,} from "../redux/slices/AllClassesSlice";
import "./ClassModal.css";

interface ClassModalProps {
  open: boolean;
  onClose: () => void;
}

const ClassModal = ({ open, onClose }: ClassModalProps) => {
  const dispatch = useAppDispatch();
  const { allClasses } = useAppSelector((state) => state.allClasses);

  const [name, setName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  

  useEffect(() => {
    if (open) dispatch(fetchAllClasses());
  }, [open, dispatch]);

  const filteredClasses = allClasses.filter(s =>
    s.className.toLowerCase().includes(deleteName.toLowerCase())
  );

  const handleAdd = async () => {
  if (!name.trim()) return;

  const exists = allClasses.some(
    c =>
      c.className.trim().toLowerCase() ===
      name.trim().toLowerCase()
  );

  if (exists) {
    alert("הכיתה כבר קיימת");
    return;
  }

  await dispatch(
    createAllClass({
      
      className: name,
    })
  );

  alert("הכיתה נוספה בהצלחה");
  setName("");
};
  const [showClasses, setShowClasses] =useState(false);
  const handleDelete = async (ClassName: string) => {
    const exists = allClasses.find(
      (s) =>
        s.className.trim().toLowerCase() ===
        ClassName.trim().toLowerCase()
    );

    if (!exists || !exists.allClassesID) {
      alert("כיתה לא קיימת");
      return;
    }

    await dispatch(deleteClass(exists.allClassesID));
    alert("הכיתה נמחקה בהצלחה");
    setDeleteName("");
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>

        <h2>ניהול כיתות</h2>
        {/*הצגה*/}

        <button
  onClick={() =>
    setShowClasses(!showClasses)
  }
>
  {showClasses
    ? "הסתר כיתות"
    : "הצג את כל הכיתות"}
</button>

{showClasses && (
  <div className="classes-list">
    {allClasses.length === 0 ? (
      <p>אין כיתות במערכת</p>
    ) : (
      allClasses.map((c) => (
        <div
          key={c.allClassesID}
          className="class-item"
        >
          {c.className}
        </div>
      ))
    )}
  </div>
)}
        {/* הוספה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלד כיתה חדשה"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          
          <button onClick={handleAdd}>הוסף כיתה</button>
        </div>

        {/* מחיקה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלידי שם כיתה"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />

          {deleteName && (
            <div className="suggestions">
              {filteredClasses.map((c) => (
                <div
                  key={c.allClassesID}
                  className="suggestion-item"
                  onClick={() => setDeleteName(c.className)}
                >
                  {c.className}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => handleDelete(deleteName)}>מחק כיתה</button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;