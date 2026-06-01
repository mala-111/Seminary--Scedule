

import axios from "axios";

import type{ AllClasses } from "../redux/types/allClasses";

const BASE_URL =
  "https://localhost:5049/api/AllClasses";

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