import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AdminPage from "../pages/FormAdmin";
import adminReducer from "../redux/slices/AdminSlice";
import employeeReducer from "../redux/slices/EmployeeSlice";
import classReducer from "../redux/slices/ClassSlice";
import { describe, expect, vi } from "vitest";

// Mocks for Modals
vi.mock("../components/SubjectModal", () => ({
  default: ({ open }: any) => (open ? <div>SubjectModal</div> : null),
}));

vi.mock("../components/EmployeeModal", () => ({
  default: ({ open }: any) => (open ? <div>EmployeeModal</div> : null),
}));

vi.mock("../components/ClassModal", () => ({
  default: ({ open }: any) => (open ? <div>ClassModal</div> : null),
}));

vi.mock("../components/GradeModal", () => ({
  default: ({ open }: any) => (open ? <div>GradeModal</div> : null),
}));

vi.mock("../components/AdminSettingsModal", () => ({
  default: ({ open }: any) => (open ? <div>AdminSettingsModal</div> : null),
}));
function renderWithStore() {
  const store = configureStore({
    reducer: {
      admins: adminReducer,
      employees: employeeReducer,
      class: classReducer,
    },
  });
  return { store, ...render(<Provider store={store}><AdminPage /></Provider>) };
}

describe("AdminPage Full Integration", () => {
  it("renders all buttons", () => {
    renderWithStore();
    expect(screen.getByText("ניהול מקצועות")).toBeInTheDocument();
    expect(screen.getByText("ניהול עובדים")).toBeInTheDocument();
    expect(screen.getByText("ניהול כיתות")).toBeInTheDocument();
    expect(screen.getByText("ניהול מחזורים")).toBeInTheDocument();
    expect(screen.getByText("ניהול מנהלים")).toBeInTheDocument();
  });

  it("opens and displays SubjectModal", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("ניהול מקצועות"));
    expect(screen.getByText("SubjectModal")).toBeInTheDocument();
  });

  it("opens and displays EmployeeModal", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("ניהול עובדים"));
    expect(screen.getByText("EmployeeModal")).toBeInTheDocument();
  });

  it("opens and displays ClassModal", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("ניהול כיתות"));
    expect(screen.getByText("ClassModal")).toBeInTheDocument();
  });

  it("opens and displays GradeModal", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("ניהול מחזורים"));
    expect(screen.getByText("GradeModal")).toBeInTheDocument();
  });

  it("opens and displays AdminSettingsModal", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("ניהול מנהלים"));
    expect(screen.getByText("AdminSettingsModal")).toBeInTheDocument();
  });
});