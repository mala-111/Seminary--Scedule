// ============================================
// src/api/teacherToSubjectApi.ts
// ============================================

import axios from "axios";

import type{ TeacherToSubject } from "../redux/types/teacherToSubject";

const BASE_URL =
  "https://localhost:5049/api/TeacherToSubject";

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