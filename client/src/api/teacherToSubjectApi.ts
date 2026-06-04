

import axios from "axios";

import type{ TeacherToSubject } from "../redux/types/teacherToSubject";

const port = import.meta.env.VITE_API_PORT


const BASE_URL =
  `https://localhost:${port}/api/TeacherToSubject`;

export const getTeacherToSubjects =
  async () => {
    const response = await axios.get(
      `${BASE_URL}/subjectToTeacher`
    );

    return response.data;
  };

export const addTeacherToSubject =
  async (
    data: TeacherToSubject
  ) => {
    const response = await axios.post(
      `${BASE_URL}/subjectToTeacher`,
      data
    );

    return response.data;
  };

  export const assignTeacherToSubject =
  async (data: {
    teacherID: string;
    subjectName: string;
    className: string;
  }) => {

    const response = await axios.post(
      "http://localhost:5049/api/TeacherToSubject/assignByNames",
      data
    );

    return response.data;
};