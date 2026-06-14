import { configureStore } from "@reduxjs/toolkit";
import employeeReducer, {
  fetchEmployees,
  createEmployee,
} from "../redux/slices/EmployeeSlice";

import "./setupMocks";

describe("EmployeeSlice Thunks", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        employees: employeeReducer,
      },
    });
  });

  it("fetchEmployees should load employees", async () => {
    await store.dispatch(fetchEmployees());

    const state = store.getState().employees;

    expect(state.employees).toHaveLength(1);
    expect(state.employees[0].name).toBe("John Doe");
  });

  it("createEmployee should add employee", async () => {
    await store.dispatch(fetchEmployees());

    await store.dispatch(
      createEmployee({
        name: "Jane Doe",
        employeeCode: "E124",
      })
    );

    const state = store.getState().employees;

    expect(state.employees).toHaveLength(2);
    expect(state.employees[1].name).toBe("Jane Doe");
  });
});