import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../redux/teacherSlice";
import { RootState } from "../redux/store";

export default function TeachersList() {
  const dispatch = useDispatch();
  const teachers = useSelector((state: RootState) => state.teachers.teachers);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  return (
    <div>
      <h2>Teachers</h2>

      {teachers.map((t) => (
        <div key={t.teacherID}>
          {t.name} - {t.employeeCode}
        </div>
      ))}
    </div>
  );
}