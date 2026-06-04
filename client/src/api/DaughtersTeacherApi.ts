import axios from "axios";
import type { DaughtersTeacher } from "../redux/types/DaughtersTeacher";

const port = import.meta.env.VITE_API_PORT

const API_URL = `http://localhost:${port}/api/DaughtersTeacher`;

// GET כל הכיתות של מורה מסוים
export const getDaughtersTeachers = async (teacherID: string): Promise<DaughtersTeacher[]> => {
  const res = await axios.get(`${API_URL}/teacher/${teacherID}`);
  return res.data;
};

// POST - הוספה
export const addDaughtersTeacher = async (
  daughtersTeacher: Omit<DaughtersTeacher, "classDaughtersTeacherID">
): Promise<DaughtersTeacher> => {
  const res = await axios.post(`${API_URL}/new`, daughtersTeacher);
  return res.data;
};

// PUT - מחיקה (מכניס היסטוריה)
export const removeDaughtersTeacher = async (
  classDaughtersTeacherID: string
): Promise<void> => {
await axios.put(`${API_URL}/delete/${classDaughtersTeacherID}`);};