

import axios from "axios";

import type{ AllClasses } from "../redux/types/allClasses";


const BASE_URL =
  `${import.meta.env.VITE_API_URL}/api/AllClasses`;

  


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