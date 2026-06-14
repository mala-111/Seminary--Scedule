import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getSubjects,
  addSubject,
  deleteSubject as deleteSubjectApi,
} from "../../api/subjectApi";

import type { Subject } from "../types/subject";

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
};

// GET

export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",

  async (_, thunkAPI) => {
    try {
      return await getSubjects();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "error"
      );
    }
  }
);

// CREATE

export const createSubject = createAsyncThunk(
  "subject/createSubject",

  async (subject: Subject, thunkAPI) => {
    try {
      return await addSubject(subject);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "error"
      );
    }
  }
);

// DELETE

export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",

  async (name: string, thunkAPI) => {
    try {
      await deleteSubjectApi(name);

      return name;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "error"
      );
    }
  }
);

const subjectSlice = createSlice({
  name: "subject",

  initialState,

 reducers: {
  setSubjects: (state, action: PayloadAction<Subject[]>) => {
    state.subjects = action.payload;
  },
},
  extraReducers: (builder) => {
    // FETCH

    builder.addCase(
      fetchSubjects.pending,
      (state) => {
        state.loading = true;
      }
    );

    builder.addCase(
      fetchSubjects.fulfilled,
      (
        state,
        action: PayloadAction<Subject[]>
      ) => {
        state.loading = false;
        state.subjects = action.payload;
      }
    );

    builder.addCase(
      fetchSubjects.rejected,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // CREATE

    builder.addCase(
      createSubject.fulfilled,
      (
        state,
        action: PayloadAction<Subject>
      ) => {
        state.subjects.push(action.payload);
      }
    );

    // DELETE

    builder.addCase(
      deleteSubject.fulfilled,
      (
        state,
        action: PayloadAction<string>
      ) => {
        state.subjects = state.subjects.filter(
          (s) => s.name !== action.payload
        );
      }
    );
  },
});

export const { setSubjects } = subjectSlice.actions; // ✅ זה חשוב
export default subjectSlice.reducer;