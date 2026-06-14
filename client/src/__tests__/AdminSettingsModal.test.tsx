// src/__tests__/AdminSettingsModal.test.tsx
import { render, screen,  act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import adminReducer, { addAdmin, changePassword, deleteAdmin } from "../redux/slices/AdminSlice";
import AdminSettingsModal from "../components/AdminSettingsModal";

function renderWithStore(open = true) {
  const store = configureStore({ reducer: { admins: adminReducer } });
  render(
    <Provider store={store}>
      <AdminSettingsModal open={open} onClose={() => {}} />
    </Provider>
  );
  return store;
}

describe("AdminSettingsModal", () => {

  it("renders modal content", () => {
    renderWithStore();
    expect(screen.getByText(/adminaration/i)).toBeInTheDocument();
  });

  it("can add a new admin", async () => {
    const store = renderWithStore();

    await act(async () => {
      store.dispatch(addAdmin({ username: "newAdmin", password: "pass123" }));
    });

    expect(
      store.getState().admins.admins.find((a: any) => a.username === "newAdmin")
    ).toBeDefined();
  });

  it("can change password", async () => {
    const store = renderWithStore();

    await act(async () => {
      store.dispatch(changePassword({ username: "adminaration", newPassword: "newpass" }));
    });

    expect(store.getState().admins.admins[0].password).toBe("newpass");
  });

  it("cannot delete super admin", async () => {
    const store = renderWithStore();

    await act(async () => {
      store.dispatch(deleteAdmin("adminaration"));
    });

    expect(
      store.getState().admins.admins.find((a: any) => a.username === "adminaration")
    ).toBeDefined();
  });
});