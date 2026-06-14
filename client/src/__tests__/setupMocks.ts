import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// ===== STATE =====

let subjects = [
  { subjectID: "1", name: "Math", category: "חול" }
];

http.get("/api/Subject/showSchedule/subject", () => {
  return HttpResponse.json(subjects);
});
let employees = [
  {
    employeeId: "1",
    name: "John Doe",
    employeeCode: "E123",
  },
];

const initialClasses = [
  { classID: "1", name: "Class A" },
];

let classes = [...initialClasses];

export const resetClasses = () => {
  classes = [...initialClasses];
};


afterEach(() => {
  server.resetHandlers();
  resetClasses(); // 🔥 זה מה שחסר לך
});
// ===== SERVER =====
export const server = setupServer(
  // ---------------- EMPLOYEES ----------------
  http.get("/api/Employee/all", () => {
    return HttpResponse.json(employees);
  }),

  http.post("/api/Employee/new", async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      employeeCode: string;
    };

    const newEmployee = {
      employeeId: (employees.length + 1).toString(),
      name: body.name,
      employeeCode: body.employeeCode,
    };

    employees.push(newEmployee);

    return HttpResponse.json(newEmployee);
  }),
http.get("/api/Subject/showSchedule/subject", () => {
  return HttpResponse.json([
    {
      subjectID: "1",
      name: "Math",
      category: "חול",
    },
  ]);
}),
http.get("/api/AllClasses/showSchedule/classes", () => {
  return HttpResponse.json([
    {
      allClassesID: "1",
      className: "Class A",
    },
  ]);
}),
  // ---------------- CLASSES ----------------
  http.get("/api/Class", () => HttpResponse.json(classes)),

http.post("/api/Class", async ({ request }) => {
  const body = await request.json() as { name: string };
  const newClass = { classID: (classes.length + 1).toString(), name: body.name };
  classes.push(newClass);
  return HttpResponse.json(newClass); // <-- חשוב שה־Redux יוכל לעשות push
}),

  http.put("/api/Class/:id", async ({ request, params }) => {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
    };

    const index = classes.findIndex((c) => c.classID === params.id);

    if (index !== -1) {
      classes[index] = {
        ...classes[index],
        ...body,
      };
    }

    return HttpResponse.json(classes[index] ?? { classID: params.id });
  }),

  http.delete("/api/Class/:id", ({ params }) => {
    classes = classes.filter((c) => c.classID !== params.id);

    return HttpResponse.json({ success: true });
  })
);


// ===== LIFECYCLE =====
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());