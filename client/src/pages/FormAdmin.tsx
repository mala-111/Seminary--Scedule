import { useEffect, useState } from "react";

import "./FormAdmin.css";

import {
  fetchSubjects,
  createSubject,
  deleteSubject,
} from "../redux/slices/SubjectSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../redux/hooks";

const SubjectAdmin = () => {
  const dispatch = useAppDispatch();

  const { subjects } = useAppSelector(
    (state) => state.subject
  );

  const [name, setName] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const [category, setCategory] =
    useState("חול");

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);
const filteredSubjects = subjects.filter(
  (s) =>
    s.name
      .toLowerCase()
      .includes(deleteName.toLowerCase())
);
  const handleAdd = async () => {
    if (!name.trim()) return;

    await dispatch(
      createSubject({
        name,
        category,
      })
    );

    setName("");
  };

  const handleDelete = async (
    name: string
  ) => {
    await dispatch(deleteSubject(name));
  };

  return (
    <div className="subject-admin">
      <h2>ניהול מקצועות</h2>

      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="שם מקצוע"
      />

      <h3>קטגוריה</h3>

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option value="קודש">
          קודש
        </option>

        <option value="חול">
          חול
        </option>

        <option value="הקבצות">
          הקבצות
        </option>
      </select>

      <button onClick={handleAdd}>
        הוסף מקצוע
      </button>

      <hr />

     <h3>מחיקת מקצוע</h3>

<input
  type="text"
  placeholder="הקלידי שם מקצוע"
  value={deleteName}
  onChange={(e) =>
    setDeleteName(e.target.value)
  }
/>

{deleteName && (
  <div className="suggestions">
    {filteredSubjects.map((subject) => (
      <div
        key={subject.subjectID}
        className="suggestion-item"
        onClick={() =>
          setDeleteName(subject.name)
        }
      >
        {subject.name}
      </div>
    ))}
  </div>
)}

<button
  className="delete-btn"
  onClick={() => {
    if (!deleteName.trim()) return;

    dispatch(deleteSubject(deleteName));

    setDeleteName("");
  }}
>
  מחק מקצוע
</button>
    </div>
  );
};

export default SubjectAdmin;