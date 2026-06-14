import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Form from "../pages/Form";
import { store } from "../redux/store";
import { describe, test, expect, vi } from "vitest";

const mockDispatch = vi.fn();

vi.mock("../redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({
    allClasses: [
      {
        allClassesID: "1",
        className: "ז1"
      },
      {
        allClassesID: "2",
        className: "ח1"
      }
    ]
  })
}));

vi.mock("../components/ProfessionModal", () => ({
  default: () => <div />
}));

vi.mock("../components/ScheduleModal", () => ({
  default: () => <div />
}));

vi.mock("../components/DayOff", () => ({
  default: () => <div />
}));
vi.mock("react-router-dom", async() => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      state: {
        username: "Sara",
        password: "1234"
      }
    }) 
  };
});

const renderForm = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Form />
      </MemoryRouter>
    </Provider>
  );

describe("Form Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.alert = vi.fn();

    localStorage.clear();
  });

  test("renders greeting", () => {
    renderForm();

    expect(screen.getByText(/שלום ל/i)).toBeInTheDocument();
  });

  test("renders save button", () => {
    renderForm();

    expect(
      screen.getByText("שמירת פרטים")
    ).toBeInTheDocument();
  });

  test("renders professions button", () => {
    renderForm();

    expect(
      screen.getByText("מקצועות")
    ).toBeInTheDocument();
  });

  test("renders schedule button", () => {
    renderForm();

    expect(
      screen.getByText("הקלדת שעות תפוסות")
    ).toBeInTheDocument();
  });

  test("renders day off button", () => {
    renderForm();

    expect(
      screen.getByText("בחירת יום חופשי")
    ).toBeInTheDocument();
  });

  test("select class teacher yes", () => {
    renderForm();

    fireEvent.click(screen.getAllByText("כן")[0]);

    expect(
      screen.getByText("בחרי כיתה למחנכת")
    ).toBeInTheDocument();
  });

  test("hours lower than minimum", () => {
    renderForm();

    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, {
      target: {
        value: "1"
      }
    });

    expect(input).toHaveValue(6);
  });

  test("hours greater than maximum", () => {
    renderForm();

    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, {
      target: {
        value: "50"
      }
    });

    expect(input).toHaveValue(30);
  });

  test("invalid class name", () => {
    renderForm();

    const classInput =
      screen.getByPlaceholderText("הקלידי כיתה");

    fireEvent.change(classInput, {
      target: {
        value: "ABC123"
      }
    });

    fireEvent.keyDown(classInput, {
      key: "Enter",
      code: "Enter"
    });

    expect(window.alert).toHaveBeenCalledWith(
      "כיתה לא תקינה. יש להזין 1-2 אותיות ולאחריהן 1-2 ספרות ללא רווחים"
    );
  });

  test("class not found", () => {
    renderForm();

    const classInput =
      screen.getByPlaceholderText("הקלידי כיתה");

    fireEvent.change(classInput, {
      target: {
        value: "ט9"
      }
    });

    fireEvent.keyDown(classInput, {
      key: "Enter",
      code: "Enter"
    });

    expect(window.alert).toHaveBeenCalledWith(
      "הכיתה אינה קיימת במערכת"
    );
  });

test("valid class added", async () => {
  renderForm();

  const classInput = screen.getByPlaceholderText("הקלידי כיתה");

  fireEvent.change(classInput, {
    target: { value: "ז1" }
  });

  fireEvent.keyDown(classInput, {
    key: "Enter",
    code: "Enter"
  });

  // במקום לחפש UI — תבדוק state דרך DOM
  expect(await screen.findByText("ז1")).toBeInTheDocument();
});

  test("save without required data", () => {
    renderForm();

    fireEvent.click(
      screen.getByText("שמירת פרטים")
    );

    expect(window.alert).toHaveBeenCalledWith(
      "חובה למלא את כל השדות ולבחור 3 עדיפויות ליום חופשי"
    );
  });

  test("loads saved data from localStorage", () => {
    localStorage.setItem(
      "saved_user_data",
      JSON.stringify({
        Sara_1234: {
          hours: "20",
          format: "כן",
          branch: "",
          saved: true
        }
      })
    );

    renderForm();

    expect(
      screen.getByRole("spinbutton")
    ).toHaveValue(20);
  });
});