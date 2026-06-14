// src/__tests__/ProfessionModal.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfessionModal from "../components/ProfessionModal";
import { describe, test, expect, vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// -----------------
// Dummy slice for tests
// -----------------
const subjectSlice = createSlice({
  name: "subject",
  initialState: { subjects: [] },
  reducers: {},
});

// -----------------
// Helper render
// -----------------
function renderWithStore(
  open = true,
  onClose = vi.fn(),
  onSaveProfession = vi.fn()
) {
  const store = configureStore({
    reducer: {
      subject: subjectSlice.reducer,
    },
  });

  render(
    <Provider store={store}>
      <ProfessionModal
        open={open}
        onClose={onClose}
        onSaveProfession={onSaveProfession}
      />
    </Provider>
  );

  return { store, onClose, onSaveProfession };
}

// -----------------
// mocks
// -----------------
vi.mock("../components/SacredProfessions", () => ({
  default: (props: any) => (
    <div>
      <div>Mock Sacred</div>
      <button onClick={() => props.onSave("גמרא", ["א", "ב"])}>
        Save Sacred
      </button>
      <button onClick={props.onClose}>Back Sacred</button>
    </div>
  ),
}));

vi.mock("../components/SandProfessions", () => ({
  default: (props: any) => (
    <div>
      <div>Mock Sand</div>
      <button onClick={() => props.onSave("מתמטיקה", ["ז"])}>
        Save Sand
      </button>
      <button onClick={props.onClose}>Back Sand</button>
    </div>
  ),
}));

vi.mock("../components/GroupsProfessions", () => ({
  default: (props: any) => (
    <div>
      <div>Mock Groups</div>
      <button onClick={() => props.onSave("אנגלית", ["ח"])}>
        Save Groups
      </button>
      <button onClick={props.onClose}>Back Groups</button>
    </div>
  ),
}));

// -----------------
// Tests
// -----------------
describe("ProfessionModal", () => {
  test("does not render when open is false", () => {
    renderWithStore(false);
    expect(screen.queryByText("בחירת מקצועות")).not.toBeInTheDocument();
  });

  test("renders main categories when open", () => {
    renderWithStore();
    expect(screen.getByText("בחירת מקצועות")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "מקצועות קודש" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "מקצועות חול" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הקבצות" })).toBeInTheDocument();
  });

  test("calls onClose when clicking חזרה", () => {
    const { onClose } = renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "חזרה" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("opens SacredProfessions", () => {
    renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "מקצועות קודש" }));
    expect(screen.getByText("Mock Sacred")).toBeInTheDocument();
  });

  test("opens SandProfessions", () => {
    renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "מקצועות חול" }));
    expect(screen.getByText("Mock Sand")).toBeInTheDocument();
  });

  test("opens GroupsProfessions", () => {
    renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "הקבצות" }));
    expect(screen.getByText("Mock Groups")).toBeInTheDocument();
  });

  test("passes save callback from SacredProfessions", () => {
    const { onSaveProfession } = renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "מקצועות קודש" }));
    fireEvent.click(screen.getByText("Save Sacred"));
    expect(onSaveProfession).toHaveBeenCalledWith("גמרא", ["א", "ב"]);
  });

  test("returns to categories from child component", () => {
    renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: "מקצועות קודש" }));
    fireEvent.click(screen.getByText("Back Sacred"));
    expect(screen.getByText("בחירת מקצועות")).toBeInTheDocument();
  });
});