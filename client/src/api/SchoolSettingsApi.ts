import axios from "axios";

import type { SchoolSettings } from "../redux/types/SchoolSettings";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/SchoolSettings`;
console.log("BASE_URL", BASE_URL);

// GET settings
export const getSchoolSettings = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

// SAVE settings (create or update)
export const saveSchoolSettings = async (data: SchoolSettings) => {
  const response = await axios.post(`${BASE_URL}`, data);
  return response.data;
};

// RESET settings
export const resetSchoolSettings = async () => {
  const response = await axios.put(`${BASE_URL}/reset`);
  return response.data;
};