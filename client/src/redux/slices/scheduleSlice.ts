

import {createSlice,createAsyncThunk, type PayloadAction,} from "@reduxjs/toolkit";
import {getSchedules,addSchedule,} from "../../api/scheduleApi";
import type { Schedule } from "../types/schedule";


interface ScheduleState {
  schedules: Schedule[];

  loading: boolean;

  error: string | null;
}



// INITIAL STATE

const initialState: ScheduleState = {
  schedules: [],

  loading: false,

  error: null,
};


// GET SCHEDULES

export const fetchSchedules =
  createAsyncThunk(
    "schedule/fetchSchedules",

    async (_, thunkAPI) => {
      try {
        return await getSchedules();
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data ||
            "שגיאה בטעינת מערכת"
        );
      }
    }
  );

// CREATE SCHEDULE

export const createSchedule =
  createAsyncThunk(
    "schedule/createSchedule",

    async (
      schedule: Omit<
        Schedule,
        "scheduleId"
      >,
      thunkAPI
    ) => {
      try {
        return await addSchedule(
          schedule
        );
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data ||
            "שגיאה בשמירה"
        );
      }
    }
  );


// SLICE


const ScheduleSlice = createSlice({
  name: "schedule",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // ---------------- FETCH ----------------

    builder.addCase(
      fetchSchedules.pending,
      (state) => {
        state.loading = true;

        state.error = null;
      }
    );

    builder.addCase(
      fetchSchedules.fulfilled,
      (
        state,
        action: PayloadAction<
          Schedule[]
        >
      ) => {
        state.loading = false;

        state.schedules =
          action.payload;
      }
    );

    builder.addCase(
      fetchSchedules.rejected,
      (state, action: any) => {
        state.loading = false;

        state.error =
          action.payload;
      }
    );

    //CREATE 

    builder.addCase(
      createSchedule.pending,
      (state) => {
        state.loading = true;

        state.error = null;
      }
    );

    builder.addCase(
      createSchedule.fulfilled,
      (
        state,
        action: PayloadAction<
          Schedule
        >
      ) => {
        state.loading = false;

        state.schedules.push(
          action.payload
        );
      }
    );

    builder.addCase(
      createSchedule.rejected,
      (state, action: any) => {
        state.loading = false;

        state.error =
          action.payload;
      }
    );
  },
});

export default ScheduleSlice.reducer;