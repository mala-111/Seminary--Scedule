import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DaughtersTeacher } from "../types/DaughtersTeacher";
import { getDaughtersTeachers, addDaughtersTeacher, removeDaughtersTeacher } from "../../api/DaughtersTeacherApi";

interface DaughtersTeacherState {
  data: DaughtersTeacher[];
  loading: boolean;
  error: string | null;
}

const initialState: DaughtersTeacherState = {
  data: [],
  loading: false,
  error: null,
};

// GET
export const fetchDaughtersTeachers = createAsyncThunk(
  "daughtersTeachers/fetch",
  async (teacherID: string, thunkAPI) => {
    try {
      return await getDaughtersTeachers(teacherID);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

// POST
export const createDaughtersTeacher = createAsyncThunk(
  "daughtersTeachers/create",
  async (teacher: Omit<DaughtersTeacher, "classDaughtersTeacherID">, thunkAPI) => {
    try {
      return await addDaughtersTeacher(teacher);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

// PUT למחיקה (הוספה להיסטוריה)
export const deleteDaughtersTeacher = createAsyncThunk(
  "daughtersTeachers/delete",
  async (classDaughtersTeacherID: string, thunkAPI) => {
    try {
      await removeDaughtersTeacher(classDaughtersTeacherID);
      return classDaughtersTeacherID;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const DaughtersTeacherSlice = createSlice({
  name: "daughtersTeachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchDaughtersTeachers.pending, (state) => { state.loading = true; })
      .addCase(fetchDaughtersTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDaughtersTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createDaughtersTeacher.pending, (state) => { state.loading = true; })
      .addCase(createDaughtersTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createDaughtersTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(deleteDaughtersTeacher.pending, (state) => { state.loading = true; })
      .addCase(deleteDaughtersTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(d => d.classDaughtersTeacherID !== action.payload);
      })
      .addCase(deleteDaughtersTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default DaughtersTeacherSlice.reducer;