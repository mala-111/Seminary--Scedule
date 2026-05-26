import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTeachers, addTeacher } from "../../api/teacherApi";
import type { Teacher } from "../types/teacher";

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,
};

// GET
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (_, thunkAPI) => {
    try {
      return await getTeachers();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

// POST
export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (teacher: Omit<Teacher, "teacherID">, thunkAPI) => {
    try {
      return await addTeacher(teacher);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.push(action.payload);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;