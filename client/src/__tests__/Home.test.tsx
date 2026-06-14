import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { BrowserRouter } from "react-router-dom";
import {  test, expect, vi } from "vitest";

import "@testing-library/jest-dom"; // ✅ במקום vi-dom (או בלי בכלל אם כבר מוגדר ב-setup)

test("renders login inputs and button", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByPlaceholderText(/שם משתמש/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/סיסמה/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /כניסה למערכת/i })).toBeInTheDocument();
});

test("shows alert on empty login", () => {
  window.alert = vi.fn();

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole("button", { name: /כניסה למערכת/i }));
  expect(window.alert).toHaveBeenCalledWith("חובה למלא שם משתמש וסיסמה");
});