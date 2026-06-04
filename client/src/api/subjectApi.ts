import axios from "axios";
import type { Subject } from "../redux/types/subject";


const port = import.meta.env.VITE_API_PORT

const BASE_URL =
  `http://localhost:${port}/api/Subject`;

export const getSubjects = async () => {
  const response = await axios.get(
    `${BASE_URL}/showSchedule/subject`
  );

  return response.data;
};

export const addSubject = async (
  subject: Subject
) => {
  const response = await axios.post(
    `${BASE_URL}/addSubject`,
    subject
  );

  return response.data;
};

export const deleteSubject = async (
  name: string
) => {
  const response = await axios.put(
    `${BASE_URL}/delete/subject/${encodeURIComponent(
      name
    )}`
  );

  return response.data;
};