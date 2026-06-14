import { render, screen, fireEvent } from "@testing-library/react";
import ScheduleModal from "../components/ScheduleModal";
import { describe, test, expect, vi } from "vitest";

describe("ScheduleModal Component", () => {
  test("renders table and selects hours", () => {
    const addScheduleMock = vi.fn();
    const onCloseMock = vi.fn();
    render(<ScheduleModal open={true} addSchedule={addScheduleMock} onClose={onCloseMock} username="u" />);

    const cell = screen.getByText("8:00").closest("tr")!.querySelector("td:nth-child(2)");
    fireEvent.click(cell!);
    expect(cell).toHaveClass("selected");
  });

  test("requires branch name to add schedule", () => {
    const addScheduleMock = vi.fn();
    const onCloseMock = vi.fn();
const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<ScheduleModal open={true} addSchedule={addScheduleMock} onClose={onCloseMock} username="u" />);
    fireEvent.click(screen.getByText("הוספת סניף"));
    expect(alertMock).toHaveBeenCalledWith("חובה להזין שם סניף");
  });
});