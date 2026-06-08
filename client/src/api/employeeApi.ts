import axios from "axios";
import type { Employee } from "../redux/types/employee";

const API_URL =
  `/api/Employee`;

  console.log("API_URL:", import.meta.env.VITE_API_URL);
console.log("FULL URL:", `${API_URL}/all`);

export const getEmployees =
  async (): Promise<Employee[]> => {
    const res =
      await axios.get(`${API_URL}/all`);

    return res.data;
  };

export const addEmployee =
  async (
    employee: Omit<Employee, "employeeId">
  ): Promise<Employee> => {
    const res =
      await axios.post(
        `${API_URL}/new`,
        employee
      );

    return res.data;
  };

export const deleteEmployee =
  async (
    employeeId: string
  ): Promise<void> => {
    await axios.put(
      `${API_URL}/delete/${employeeId}`
    );
  };