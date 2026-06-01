import { useState } from "react";
import "./SacredProfessions.css";
import GroupMarking from "./GroupMarking";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { useAppSelector } from "../redux/hooks";
import { fetchSubjects } from "../redux/slices/SubjectSlice";

interface Props {
  onClose: () => void;
  onSave: (profession: string, cycles: string[]) => void;
}


const SacredProfessions = ({ onClose, onSave }: Props) => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();

const { subjects } = useAppSelector(
  (state) => state.subject
);





useEffect(() => {
  dispatch(fetchSubjects());
}, [dispatch]);

 const filteredList = subjects
  .filter((s) => s.category === "קודש")
  .filter((s) =>
    s.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>מקצועות קודש</h2>
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
                <button key={p.subjectID} onClick={() => setSelectedProfession(p.name)}>
                  {p.name}
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

export default SacredProfessions;