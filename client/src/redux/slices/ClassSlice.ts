import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getClasses,
  addClass,
  deleteClass as deleteClassApi,
} from "../../api/classApi";

import type { Class } from "../types/class";

interface ClassState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  loading: false,
  error: null,
};

// GET
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (_, thunkAPI) => {
    try {
      return await getClasses();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data
      );
    }
  }
);

// CREATE
export const createClass = createAsyncThunk(
  "class/createClass",
  async (newClass: Class, thunkAPI) => {
    try {
      return await addClass(newClass);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data
      );
    }
  }
);

// DELETE  ← הוספה חשובה
export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (id: string, thunkAPI) => {
    try {
      await deleteClassApi(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data
      );
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchClasses.fulfilled,
        (state, action: PayloadAction<Class[]>) => {
          state.loading = false;
          state.classes = action.payload;
        }
      )

      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(
        createClass.fulfilled,
        (state, action: PayloadAction<Class>) => {
          state.classes.push(action.payload);
        }
      )

      // DELETE ← הוספה
      .addCase(
        deleteClass.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.classes = state.classes.filter(
            (c) => c.classID !== action.payload
          );
        }
      );
  },
});

export default classSlice.reducer;