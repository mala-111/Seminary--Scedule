import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getEmployees,
  addEmployee,
} from "../../api/employeeApi";

import type { Employee }
from "../types/employee";

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const fetchEmployees =
  createAsyncThunk(
    "employees/fetchEmployees",
    async (_, thunkAPI) => {
      try {
        return await getEmployees();
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }
    }
  );

export const createEmployee =
  createAsyncThunk(
    "employees/createEmployee",
    async (
      employee: Omit<Employee, "employeeId">,
      thunkAPI
    ) => {
      try {
        return await addEmployee(employee);
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }
    }
  );

const EmployeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchEmployees.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchEmployees.fulfilled,
        (state, action) => {
          state.loading = false;
          state.employees =
            action.payload;
        }
      )

      .addCase(
        fetchEmployees.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      .addCase(
        createEmployee.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        createEmployee.fulfilled,
        (state, action) => {
          state.loading = false;

          state.employees.push(
            action.payload
          );
        }
      )

      .addCase(
        createEmployee.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );
  },
});

export default EmployeeSlice.reducer;