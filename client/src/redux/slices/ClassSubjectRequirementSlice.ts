import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getClassSubjectRequirements,
  getByClass,
  addClassSubjectRequirement,
  updateClassSubjectRequirement,
  deleteClassSubjectRequirement,
} from "../../api/ClassSubjectRequirementApi";

import type { ClassSubjectRequirement } from "../types/ClassSubjectRequirement";

interface ClassSubjectRequirementState {
  requirements: ClassSubjectRequirement[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassSubjectRequirementState = {
  requirements: [],
  loading: false,
  error: null,
};

// GET ALL
export const fetchRequirements = createAsyncThunk(
  "classSubjectRequirement/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await getClassSubjectRequirements();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// GET BY CLASS
export const fetchByClass = createAsyncThunk(
  "classSubjectRequirement/fetchByClass",
  async (classId: string, thunkAPI) => {
    try {
      return await getByClass(classId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// CREATE
export const createRequirement = createAsyncThunk(
  "classSubjectRequirement/create",
  async (data: ClassSubjectRequirement, thunkAPI) => {
    try {
      return await addClassSubjectRequirement(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// UPDATE
export const updateRequirement = createAsyncThunk(
  "classSubjectRequirement/update",
  async (
    payload: { id: string; data: ClassSubjectRequirement },
    thunkAPI
  ) => {
    try {
      return await updateClassSubjectRequirement(
        payload.id,
        payload.data
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// DELETE
export const deleteRequirement = createAsyncThunk(
  "classSubjectRequirement/delete",
  async (id: string, thunkAPI) => {
    try {
      await deleteClassSubjectRequirement(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const classSubjectRequirementSlice = createSlice({
  name: "classSubjectRequirement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(fetchRequirements.fulfilled, (state, action: PayloadAction<ClassSubjectRequirement[]>) => {
        state.requirements = action.payload;
      })

      // GET BY CLASS (מחליף את הרשימה)
      .addCase(fetchByClass.fulfilled, (state, action: PayloadAction<ClassSubjectRequirement[]>) => {
        state.requirements = action.payload;
      })

      // CREATE
      .addCase(createRequirement.fulfilled, (state, action: PayloadAction<ClassSubjectRequirement>) => {
        state.requirements.push(action.payload);
      })

      // UPDATE
      .addCase(updateRequirement.fulfilled, (state, action: PayloadAction<ClassSubjectRequirement>) => {
        const index = state.requirements.findIndex(
          (r) => r.classSubjectRequirementId === action.payload.classSubjectRequirementId
        );
        if (index !== -1) {
          state.requirements[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteRequirement.fulfilled, (state, action: PayloadAction<string>) => {
        state.requirements = state.requirements.filter(
          (r) => r.classSubjectRequirementId !== action.payload
        );
      });
  },
});

export default classSubjectRequirementSlice.reducer;