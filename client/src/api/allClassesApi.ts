

import axios from "axios";

import type{ AllClasses } from "../redux/types/allClasses";

const port = import.meta.env.VITE_API_PORT
console.log("API PORT:", port);
const BASE_URL =
  `http://localhost:${port}/api/AllClasses`;
  console.log("BASE_URL:", BASE_URL);

export const getAllClasses = async () => {
  const response = await axios.get(
    `${BASE_URL}/showSchedule/classes`
  );

  return response.data;
};

export const addAllClass = async (
  newClass: AllClasses
) => {
  const response = await axios.post(
    `${BASE_URL}/newClass`,
    {
      name: newClass.className,
    }
  );

  return response.data;
};
export const deleteClass = async (
  id: string
): Promise<void> => {
  await axios.put(
    `${BASE_URL}/delete/${id}`
  );
};