// src/__tests__/slices/AdminSlice.test.ts
import adminReducer, { addAdmin, changePassword, deleteAdmin } from "../redux/slices/AdminSlice";

describe("AdminSlice Reducers", () => {
  let state: any;

  beforeEach(() => {
    state = { admins: [{ username: "adminaration", password: "1234" }] };
  });

  it("addAdmin should add new admin", () => {
    state = adminReducer(state, addAdmin({ username: "newAdmin", password: "abcd" }));
    expect(state.admins).toHaveLength(2);
    expect(state.admins[1].username).toBe("newAdmin");
  });

  it("changePassword should update password", () => {
    state = adminReducer(state, changePassword({ username: "adminaration", newPassword: "4321" }));
    expect(state.admins[0].password).toBe("4321");
  });

  it("deleteAdmin should remove admin", () => {
    state = adminReducer(state, addAdmin({ username: "toDelete", password: "pass" }));
    state = adminReducer(state, deleteAdmin("toDelete"));
    expect(state.admins.find((a: any) => a.username === "toDelete")).toBeUndefined();
  });

  it("should not delete main admin", () => {
    state = adminReducer(state, deleteAdmin("adminaration"));
    expect(state.admins.find((a: any) => a.username === "adminaration")).toBeDefined();
  });
});