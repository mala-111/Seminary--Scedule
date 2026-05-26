import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTeachers, createTeacher } from "../redux/slices/teacherSlice";
import "./FormAdmin.css";

export default function FormAdmin() {
  const dispatch = useAppDispatch();

  const { teachers, loading, error } = useAppSelector(
    (state) => state.teachers
  );

  const [name, setName] = useState("");
const [employeeCode, setEmployeeCode] = useState("");
const [weeklyHours, setWeeklyHours] = useState(0);
const [preferredDayOff, setPreferredDayOff] = useState("");
const [isClassTeacher, setIsClassTeacher] = useState(false);
const [isGroupingTeacher, setIsGroupingTeacher] = useState(false);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleAdd = () => {
    if (!name || !employeeCode) return;

    dispatch(
      createTeacher({
        name,
        employeeCode,
        weeklyHours: 0,
        preferredDayOff: "",
        isClassTeacher: false,
        isGroupingTeacher: false,
      })
    );

    setName("");
    setEmployeeCode("");
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      {/* FORM */}
      <div>
        <input
  type="number"
  placeholder="Weekly Hours"
  value={weeklyHours}
  onChange={(e) => setWeeklyHours(Number(e.target.value))}
/>

<input
  placeholder="Preferred Day Off"
  value={preferredDayOff}
  onChange={(e) => setPreferredDayOff(e.target.value)}
/>

<label>
  <input
    type="checkbox"
    checked={isClassTeacher}
    onChange={(e) => setIsClassTeacher(e.target.checked)}
  />
  Class Teacher
</label>

<label>
  <input
    type="checkbox"
    checked={isGroupingTeacher}
    onChange={(e) => setIsGroupingTeacher(e.target.checked)}
  />
  Grouping Teacher
</label>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
        />

        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Loading..." : "Add Teacher"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LIST */}
      <div>
        {teachers.map((t) => (
          <div key={t.teacherID}>
            {t.name} - {t.employeeCode}
          </div>
        ))}
      </div>
    </div>
  );
}