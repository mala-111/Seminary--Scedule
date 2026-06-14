import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";


export const server = setupServer(

  http.get("/api/Subject/showSchedule/subject", () => {
    return HttpResponse.json([]);
  }),

  http.get("/api/Employee/all", () => {
    return HttpResponse.json([]);
  }),

  http.get("/api/Class", () => {
    return HttpResponse.json([]);
  }),

  http.get("/api/Teacher/showSchedule/employees/all", () => {
    return HttpResponse.json([]);
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());