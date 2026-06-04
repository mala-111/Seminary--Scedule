

import {createSlice,createAsyncThunk, type PayloadAction, } from "@reduxjs/toolkit";
import {getAllClasses,addAllClass,deleteClass as deleteClassApi, } from "../../api/allClassesApi";
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
export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id: string, thunkAPI) => {
    try {
      await deleteClassApi(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
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

        .addCase(deleteClass.fulfilled, (state, action)=>{
          state.allClasses=state.allClasses.filter(
            (c)=>c.allClassesID!==action.payload
          )
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