import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SquadsPage from "@/app/teams/squads/page";

// Mock the Radix UI icons
vi.mock("@radix-ui/react-icons", () => ({
  Pencil1Icon: () => <div data-testid="pencil-icon" />,
  TrashIcon: () => <div data-testid="trash-icon" />,
}));

describe("SquadsPage component", () => {
  it("renders the page title", () => {
    render(<SquadsPage />);
    expect(screen.getByText("Squad Management")).toBeInTheDocument();
  });

  it("displays the add squad form", () => {
    render(<SquadsPage />);
    expect(screen.getByText("Add New Squad")).toBeInTheDocument();
    expect(screen.getByLabelText("Squad Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description *")).toBeInTheDocument();
  });

  it("displays the initial squads list", () => {
    render(<SquadsPage />);
    expect(screen.getByText("Squads List")).toBeInTheDocument();
    expect(screen.getByText("Core Banking")).toBeInTheDocument();
    expect(screen.getByText("Release")).toBeInTheDocument();
    expect(screen.getByText("Savings & Transaction")).toBeInTheDocument();
    expect(screen.getByText("User Lifecycle")).toBeInTheDocument();
  });

  it("allows editing a squad", () => {
    render(<SquadsPage />);

    const editButtons = screen.getAllByTestId("pencil-icon");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Core Banking")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Squad Name *"), {
      target: { value: "Updated Core Banking" },
    });
    fireEvent.change(screen.getByLabelText("Description *"), {
      target: { value: "Updated core banking description" },
    });
    fireEvent.click(screen.getByText("Update Squad"));

    expect(screen.getByText("Updated Core Banking")).toBeInTheDocument();
    expect(
      screen.getByText("Updated core banking description")
    ).toBeInTheDocument();
  });

  it("allows deleting a squad", () => {
    render(<SquadsPage />);

    const deleteButtons = screen.getAllByTestId("trash-icon");
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText("Core Banking")).not.toBeInTheDocument();
  });
});
