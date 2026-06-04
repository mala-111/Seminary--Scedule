import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  username: string;
  password: string;
}

interface AdminState {
  admins: Admin[];
}

const initialState: AdminState = {
  admins: [
    {
      username: "adminaration",
      password: "1234",
    },
  ],
};

const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    addAdmin: (state, action: PayloadAction<Admin>) => {
      const exists = state.admins.some(
        a =>
          a.username.toLowerCase() ===
          action.payload.username.toLowerCase()
      );

      if (!exists) {
        state.admins.push(action.payload);
      }
    },

    changePassword: (
      state,
      action: PayloadAction<{
        username: string;
        newPassword: string;
      }>
    ) => {
      const admin = state.admins.find(
        a =>
          a.username.toLowerCase() ===
          action.payload.username.toLowerCase()
      );

      if (admin) {
        admin.password = action.payload.newPassword;
      }
    },

    deleteAdmin: (
      state,
      action: PayloadAction<string>
    ) => {
      if (
        action.payload.toLowerCase() ===
        "adminaration"
      ) {
        return;
      }

      state.admins = state.admins.filter(
        a =>
          a.username.toLowerCase() !==
          action.payload.toLowerCase()
      );
    },

    setAdmins: (
      state,
      action: PayloadAction<Admin[]>
    ) => {
      state.admins = action.payload;
    },
  },
});

export const {
  addAdmin,
  changePassword,
  deleteAdmin,
  setAdmins,
} = adminSlice.actions;

export default adminSlice.reducer;