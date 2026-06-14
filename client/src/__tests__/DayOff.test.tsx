import { render, screen, fireEvent } from "@testing-library/react";
import DayOff from "../components/DayOff";
import { describe, test, expect, vi } from "vitest";
describe("DayOff Component", () => {
  test("renders all days and allows selection", () => {
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();
    render(<DayOff open={true} onSaveDayOff={onSaveMock} onClose={onCloseMock} />);

    const sunday = screen.getByText("ראשון");
    fireEvent.click(sunday);

    expect(sunday).toHaveStyle("background: #f87171"); // עדיפות א
  });

  test("alerts if less than 3 days selected", () => {
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();
const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<DayOff open={true} onSaveDayOff={onSaveMock} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText("ראשון"));
    fireEvent.click(screen.getByText("שני"));
    fireEvent.click(screen.getByText("שמור"));

    expect(alertMock).toHaveBeenCalledWith("חובה לסמן 3 עדיפויות");
  });
});