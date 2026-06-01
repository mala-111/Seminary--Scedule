import { useState, useEffect } from "react";
import "./GroupsProfessions.css";
import GroupMarking from "./GroupMarking";
import { useAppDispatch } from "../redux/hooks";
import { useAppSelector } from "../redux/hooks";
import { fetchSubjects } from "../redux/slices/SubjectSlice";

interface Props {
  onClose: () => void;
  onSave: (profession: string, cycles: string[]) => void;
}

const GroupsProfessions = ({ onClose, onSave }: Props) => {
  const [selectedProfession, setSelectedProfession] =
    useState<string | null>(null);

  const dispatch = useAppDispatch();

  const { subjects } = useAppSelector(
    (state) => state.subject
  );

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const groupSubjects = subjects.filter(
    (s) =>
      s.category === "הקבצות"
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!selectedProfession ? (
          <>
            <h2>הקבצות</h2>

 <div className="profession-list">
  {groupSubjects.length > 0 ? (
    groupSubjects.map((p) => (
      <button
        key={p.subjectID}
        onClick={() =>
          setSelectedProfession(p.name)
        }
      >
        {p.name}
      </button>
    ))
  ) : (
    <p className="no-results">
      אין מקצועות להקבצות
    </p>
  )}
</div>

            <button onClick={onClose}>
              חזרה
            </button>
          </>
        ) : (
          <GroupMarking
            profession={selectedProfession}
            onConfirm={(cycles) => {
              onSave(
                selectedProfession,
                cycles
              );
              setSelectedProfession(null);
            }}
            onCancel={() =>
              setSelectedProfession(null)
            }
          />
        )}
      </div>
    </div>
  );
};

export default GroupsProfessions;