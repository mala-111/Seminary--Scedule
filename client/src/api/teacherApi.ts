import axios from "axios";
import type { Teacher } from "../redux/types/teacher";

const API_URL = "http://localhost:5049/api/Teacher";

export const getTeachers = async (): Promise<Teacher[]> => {
  const res = await axios.get(`${API_URL}/showSchedule/employees/all`);
  return res.data;
};

export const addTeacher = async (
  teacher: Omit<Teacher, "teacherID">
): Promise<Teacher> => {
  const res = await axios.post(`${API_URL}/newTeacher`, teacher);
  return res.data;
};