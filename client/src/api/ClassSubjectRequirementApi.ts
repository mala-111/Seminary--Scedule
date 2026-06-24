import axios from "axios";

import type { ClassSubjectRequirement } from "../redux/types/ClassSubjectRequirement";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/ClassSubjectRequirement`;
console.log("BASE_URL", BASE_URL);
// GET all
export const getClassSubjectRequirements = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// GET by class
export const getByClass = async (classId: string) => {
  const response = await axios.get(
    `${BASE_URL}/byClass/${classId}`
  );
  return response.data;
};

// CREATE
export const addClassSubjectRequirement = async (
  data: ClassSubjectRequirement
) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// UPDATE
export const updateClassSubjectRequirement = async (
  id: string,
  data: ClassSubjectRequirement
) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    data
  );
  return response.data;
};

// DELETE
export const deleteClassSubjectRequirement = async (
  id: string
) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};