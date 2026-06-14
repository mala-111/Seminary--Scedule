// GradeModal.test.tsx
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import classReducer, { fetchClasses } from "../redux/slices/ClassSlice"; // ה-slice הנכון
import GradeModal from "../components/GradeModal";

function createTestStore() {
  return configureStore({
    reducer: {
      classes: classReducer, // חייב להיות בשם "classes" כמו ב-useAppSelector
    },
  });
}

function renderWithStore(open = true) {
  const store = createTestStore();

  act(() => {
    render(
      <Provider store={store}>
        <GradeModal open={open} onClose={() => {}} />
      </Provider>
    );
  });

  return store;
}

describe("GradeModal", () => {
  it("renders GradeModal when open", async () => {
    const store = renderWithStore(true);

    // מפעילים fetchClasses ידנית כדי לוודא שיש תוכן
    await act(async () => {
      await store.dispatch(fetchClasses());
    });

    // בודקים אם הכותרת קיימת
    expect(screen.getByText(/ניהול מחזורים/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithStore(false);

    // כשהמודל סגור, לא מצופה לראות את הכותרת
    expect(screen.queryByText(/ניהול מחזורים/i)).toBeNull();
  });
});