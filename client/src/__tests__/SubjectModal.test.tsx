import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import subjectReducer, {
  setSubjects   // 🔴 הוספה חדשה (חייב שיהיה לך ברדוסר כזה!)
} from "../redux/slices/SubjectSlice";
import SubjectModal from "../components/SubjectModal";

function renderWithStore(open = true) {
  const store = configureStore({
    reducer: {
      subject: subjectReducer,
    },
  });

  // 🔴 הוספה קריטית: הכנסת דאטה לסטור לפני הרינדור
 store.dispatch(
  setSubjects([
    { name: "Math" },
    { name: "English" }
  ] as any)
);

  render(
    <Provider store={store}>
      <SubjectModal open={open} onClose={() => {}} />
    </Provider>
  );

  return store;
}

describe("SubjectModal", () => {
  it("renders subjects UI", () => {
    renderWithStore();

    expect(screen.getByText(/ניהול מקצועות/i)).toBeInTheDocument();
    expect(screen.getByText(/חול/i)).toBeInTheDocument();
    expect(screen.getByText(/קודש/i)).toBeInTheDocument();
  });

  // 🔴 זה הטסט שהיה לך ונכשל — עכשיו הוא יעבור
  it("renders subjects from store", async () => {
    renderWithStore();

    expect(await screen.findByText(/Math/i)).toBeInTheDocument();
  });
});