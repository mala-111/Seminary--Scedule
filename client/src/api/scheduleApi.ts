

import axios from "axios";
import type{ Schedule } from "../redux/types/schedule";

const BASE_URL =
  "https://localhost:5049/api/Schedule";

// GET
export const getSchedules =
  async () => {

    const response =
      await axios.get(
        `${BASE_URL}/showSchedule/all`
      );

    return response.data;
  };
// CREATE
export const addSchedule =
  async (
    data: Schedule
  ) => {

    const response =
      await axios.post(
        `${BASE_URL}/schedule`,
        data
      );

    return response.data;
  };