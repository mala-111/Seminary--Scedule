import axios from "axios";
import type { Teacher } from "../redux/types/teacher";

const port = import.meta.env.VITE_API_PORT


const API_URL = `http://localhost:${port}/api/Teacher`;

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