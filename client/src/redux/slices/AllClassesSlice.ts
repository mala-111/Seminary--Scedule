

import {createSlice,createAsyncThunk, type PayloadAction, } from "@reduxjs/toolkit";
import {getAllClasses,addAllClass,} from "../../api/allClassesApi";
import type{ AllClasses } from "../types/allClasses";

interface AllClassesState {
  allClasses: AllClasses[];

  loading: boolean;

  error: string | null;
}

const initialState: AllClassesState = {
  allClasses: [],

  loading: false,

  error: null,
};

export const fetchAllClasses =
  createAsyncThunk(
    "allClasses/fetchAllClasses",

    async (_, thunkAPI) => {
      try {
        return await getAllClasses();
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data
        );
      }
    }
  );

export const createAllClass =
  createAsyncThunk(
    "allClasses/createAllClass",

    async (
      data: AllClasses,
      thunkAPI
    ) => {
      try {
        return await addAllClass(
          data
        );
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data
        );
      }
    }
  );

const allClassesSlice =
  createSlice({
    name: "allClasses",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchAllClasses.fulfilled,
          (
            state,
            action: PayloadAction<
              AllClasses[]
            >
          ) => {
            state.allClasses =
              action.payload;
          }
        )

        .addCase(
          createAllClass.fulfilled,
          (
            state,
            action: PayloadAction<AllClasses>
          ) => {
            state.allClasses.push(
              action.payload
            );
          }
        );
    },
  });

export default
  allClassesSlice.reducer;