import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getHoursBooked,
  addHoursBooked,
} from "../../api/hoursBookedApi";

import type { HoursBooked } from "../types/hoursBooked";

interface HoursBookedState {
  hoursBooked: HoursBooked[];
  loading: boolean;
  error: string | null;
}

const initialState: HoursBookedState = {
  hoursBooked: [],
  loading: false,
  error: null,
};

// GET
export const fetchHoursBooked = createAsyncThunk(
  "hoursBooked/fetch",
  async (teacherId: string, thunkAPI) => {
    try {
      return await getHoursBooked(teacherId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching hours"
      );
    }
  }
);

// CREATE
export const createHoursBooked = createAsyncThunk(
  "hoursBooked/create",
  async (data: HoursBooked, thunkAPI) => {
    try {
      return await addHoursBooked(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error creating hours"
      );
    }
  }
);

const hoursBookedSlice = createSlice({
  name: "hoursBooked",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ---------------- FETCH ----------------
      .addCase(fetchHoursBooked.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchHoursBooked.fulfilled,
        (state, action: PayloadAction<HoursBooked[]>) => {
          state.loading = false;
          state.hoursBooked = action.payload;
        }
      )

      .addCase(fetchHoursBooked.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- CREATE ----------------
      .addCase(
        createHoursBooked.fulfilled,
        (state, action: PayloadAction<HoursBooked>) => {
          state.hoursBooked.push(action.payload);
        }
      )

      .addCase(createHoursBooked.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default hoursBookedSlice.reducer;