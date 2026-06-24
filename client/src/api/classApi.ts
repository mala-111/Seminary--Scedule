import axios from "axios";
import type { Class } from "../redux/types/class";


const BASE_URL = `${import.meta.env.VITE_API_URL}/api/Class`;

// GET
export const getClasses = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// CREATE
export const addClass = async (newClass: Class) => {
  const response = await axios.post(BASE_URL, newClass);
  return response.data;
};

// DELETE (PUT שלך)
export const deleteClass = async (id: string) => {
  const response = await axios.put(`${BASE_URL}/${id}`);
  return response.data;
};