// ============================================
// src/redux/slices/TeacherToSubjectSlice.ts
// ============================================

import {createSlice, createAsyncThunk, type PayloadAction,} from "@reduxjs/toolkit";
import {getTeacherToSubjects,addTeacherToSubject,} from "../../api/teacherToSubjectApi";
import type{ TeacherToSubject } from "../types/teacherToSubject";

interface TeacherToSubjectState {
  teacherToSubjects:
    TeacherToSubject[];

  loading: boolean;

  error: string | null;
}

const initialState:
  TeacherToSubjectState = {
  teacherToSubjects: [],

  loading: false,

  error: null,
};

export const fetchTeacherToSubjects =
  createAsyncThunk(
    "teacherToSubject/fetchTeacherToSubjects",

    async (_, thunkAPI) => {
      try {
        return await getTeacherToSubjects();
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data
        );
      }
    }
  );

export const createTeacherToSubject =
  createAsyncThunk(
    "teacherToSubject/createTeacherToSubject",

    async (
      data: TeacherToSubject,
      thunkAPI
    ) => {
      try {
        return await addTeacherToSubject(
          data
        );
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data
        );
      }
    }
  );

const teacherToSubjectSlice =
  createSlice({
    name: "teacherToSubject",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchTeacherToSubjects.fulfilled,
          (
            state,
            action: PayloadAction<
              TeacherToSubject[]
            >
          ) => {
            state.teacherToSubjects =
              action.payload;
          }
        )

        .addCase(
          createTeacherToSubject.fulfilled,
          (
            state,
            action: PayloadAction<TeacherToSubject>
          ) => {
            state.teacherToSubjects.push(
              action.payload
            );
          }
        );
    },
  });

export default
  teacherToSubjectSlice.reducer;