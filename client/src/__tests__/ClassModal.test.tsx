import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import allClassesReducer from "../redux/slices/AllClassesSlice";
import ClassModal from "../components/ClassModal";
import { describe, it, expect, vi } from "vitest";

// Mock API
vi.mock("../../api/classApi", () => ({
  getClasses: vi.fn().mockResolvedValue([{ allClassesID: "1", className: "Class A" }])
}));

function renderWithStore(open = true) {
  const store = configureStore({
    reducer: { allClasses: allClassesReducer },
    preloadedState: {
      allClasses: {
        allClasses: [{ allClassesID: "1", className: "Class A" }],
        loading: false,
        error: null,
      },
    },
  });

  render(
    <Provider store={store}>
      <ClassModal open={open} onClose={() => {}} />
    </Provider>
  );

  return store;
}

describe("ClassModal", () => {
  it("renders classes after clicking show button", async () => {
    renderWithStore();

    // לוחץ על כפתור הצגת כיתות
    const toggleBtn = screen.getByRole("button", { name: /הצג את כל הכיתות/i });
    await userEvent.click(toggleBtn);

    // עכשיו הטקסט אמור להופיע
    expect(await screen.findByText(/Class A/i)).toBeInTheDocument();
  });
});