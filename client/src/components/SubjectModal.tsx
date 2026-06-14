import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSubjects, createSubject, deleteSubject } from "../redux/slices/SubjectSlice";
import "./SubjectModal.css";

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
}

const SubjectModal = ({ open, onClose }: SubjectModalProps) => {
  const dispatch = useAppDispatch();
  const { subjects } = useAppSelector(state => state.subject);

  const [name, setName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [category, setCategory] = useState("חול");

  useEffect(() => {
    if (open) dispatch(fetchSubjects());
  }, [open, dispatch]);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(deleteName.toLowerCase())
  );

 const handleAdd = async () => {
  if (!name.trim()) return;

  const exists = subjects.some(
    s =>
      s.name.trim().toLowerCase() ===
      name.trim().toLowerCase()
  );

  if (exists) {
    alert("המקצוע כבר קיים");
    return;
  }

  await dispatch(
    createSubject({
      name,
      category,
    })
  );

  alert("המקצוע נוסף בהצלחה");
  setName("");
};
    const [showSubjects, setShowSubjects] =useState(false);

  const handleDelete = async (subjectName: string) => {
    const exists = subjects.find(
      (s) =>
        s.name.trim().toLowerCase() ===
        subjectName.trim().toLowerCase()
    );

    if (!exists) {
      alert("המקצוע לא קיים");
      return;
    }

    await dispatch(deleteSubject(exists.name));
    alert("המקצוע נמחק בהצלחה");
    setDeleteName("");
  };

  if (!open) return null;

  return (
   
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>

        <h2>ניהול מקצועות</h2>

                {/*הצגה*/}

<button onClick={() => setShowSubjects(!showSubjects)}>
  {showSubjects ? "הסתר מקצועות" : "הצג את כל המקצועות"}
</button>

{showSubjects && (
  <div className="classes-list">
    {subjects.length === 0 ? (
      <p>אין עובדים במערכת</p>
            ) : (
              subjects.map(e => (
                <div key={e.subjectID} className="class-item">
                  {e.name} - {e.category}
                </div>
      ))
    )}
  </div>
)}
{/* 🔵 הוספה: הצגת subjects מהסטור */}
<div className="subjects-list">
  {subjects.map((s, index) => (
    <div key={index}>
      {s.name}
    </div>
  ))}
</div>
        {/* הוספה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלד מקצוע חדש"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="חול">חול</option>
            <option value="קודש">קודש</option>
            <option value="הקבצות">הקבצות</option>
          </select>
          <button onClick={handleAdd}>הוסף מקצוע</button>
        </div>

        {/* מחיקה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלידי שם מקצוע"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />

          {deleteName && (
            <div className="suggestions">
              {filteredSubjects.map((subject) => (
                <div
                  key={subject.subjectID}
                  className="suggestion-item"
                  onClick={() => setDeleteName(subject.name)}
                >
                  {subject.name}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => handleDelete(deleteName)}>מחק מקצוע</button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;