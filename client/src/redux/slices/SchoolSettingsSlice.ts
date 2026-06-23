import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getSchoolSettings,
  saveSchoolSettings,
  resetSchoolSettings,
} from "../../api/SchoolSettingsApi";

import type { SchoolSettings } from "../types/SchoolSettings";

interface SchoolSettingsState {
  settings: SchoolSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolSettingsState = {
  settings: null,
  loading: false,
  error: null,
};

// GET
export const fetchSchoolSettings = createAsyncThunk(
  "schoolSettings/fetch",
  async (_, thunkAPI) => {
    try {
      return await getSchoolSettings();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// SAVE
export const updateSchoolSettings = createAsyncThunk(
  "schoolSettings/save",
  async (data: SchoolSettings, thunkAPI) => {
    try {
      return await saveSchoolSettings(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// RESET
export const resetSettings = createAsyncThunk(
  "schoolSettings/reset",
  async (_, thunkAPI) => {
    try {
      return await resetSchoolSettings();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const schoolSettingsSlice = createSlice({
  name: "schoolSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchSchoolSettings.fulfilled, (state, action: PayloadAction<SchoolSettings>) => {
        state.settings = action.payload;
      })

      .addCase(updateSchoolSettings.fulfilled, (state, action: PayloadAction<any>) => {
        state.settings = action.payload;
      })

      .addCase(resetSettings.fulfilled, (state) => {
        state.settings = null;
      });
  },
});

export default schoolSettingsSlice.reducer;