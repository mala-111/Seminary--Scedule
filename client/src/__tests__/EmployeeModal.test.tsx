import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../redux/slices/EmployeeSlice";
import EmployeeModal from "../components/EmployeeModal";
import { describe, it, expect } from "vitest";

function renderWithStore(open = true) {
  const store = configureStore({
    reducer: {
      employees: employeeReducer,
    },
    preloadedState: {
      employees: {
        employees: [
          { employeeId: "1", name: "John", employeeCode: "E123" }
        ],
        loading: false,
        error: null,
      },
    },
  });

  render(
    <Provider store={store}>
      <EmployeeModal open={open} onClose={() => {}} />
    </Provider>
  );

  return store;
}

describe("EmployeeModal", () => {
  it("renders employee modal", async () => {
    renderWithStore();

    const user = userEvent.setup();

    // 🔥 חייבים לפתוח את הרשימה
    await user.click(
      screen.getByRole("button", {
        name: /הצג את כל העובדים/i,
      })
    );

    expect(await screen.findByText(/John/i)).toBeInTheDocument();
  });
});