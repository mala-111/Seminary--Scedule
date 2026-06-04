
import axios from "axios";

import type{ HoursBooked } from "../redux/types/hoursBooked";

const port = import.meta.env.VITE_API_PORT


const BASE_URL =
  `http://localhost:${port}/api/HoursBooked`;

export const getHoursBooked = async (
  teacherId: string
) => {
  const response = await axios.get(
    `${BASE_URL}/showSchedule/allPersonal/${teacherId}`
  );

  return response.data;
};

export const addHoursBooked = async (
  data: HoursBooked
) => {
  const response = await axios.post(
    `${BASE_URL}/fill/weeklyHoursOccupied`,
    data
  );

  return response.data;
};