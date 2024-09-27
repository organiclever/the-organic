import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamRolesPage from "@/app/teams/roles/page";

// Mock the Radix UI icons
vi.mock("@radix-ui/react-icons", () => ({
  Pencil1Icon: () => <div data-testid="pencil-icon" />,
  TrashIcon: () => <div data-testid="trash-icon" />,
}));

describe("TeamRolesPage component", () => {
  it("renders the page title", () => {
    render(<TeamRolesPage />);
    expect(screen.getByText("Team Roles Management")).toBeInTheDocument();
  });

  it("displays the add role form", () => {
    render(<TeamRolesPage />);
    expect(screen.getByText("Add New Team Role")).toBeInTheDocument();
    expect(screen.getByLabelText("Role Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description *")).toBeInTheDocument();
  });

  it("displays the initial team roles list", () => {
    render(<TeamRolesPage />);
    expect(screen.getByText("Team Roles List")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Engineering Manager")).toBeInTheDocument();
    expect(screen.getByText("QA Engineer")).toBeInTheDocument();
    expect(screen.getByText("SEIT")).toBeInTheDocument();
  });

  it("allows editing a team role", () => {
    render(<TeamRolesPage />);

    const editButtons = screen.getAllByTestId("pencil-icon");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Backend Developer")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Role Name *"), {
      target: { value: "Senior Backend Developer" },
    });
    fireEvent.change(screen.getByLabelText("Description *"), {
      target: { value: "Leads server-side development and architecture" },
    });
    fireEvent.click(screen.getByText("Update Team Role"));

    expect(screen.getByText("Senior Backend Developer")).toBeInTheDocument();
    expect(
      screen.getByText("Leads server-side development and architecture")
    ).toBeInTheDocument();
  });

  it("allows deleting a team role", () => {
    render(<TeamRolesPage />);

    const deleteButtons = screen.getAllByTestId("trash-icon");
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText("Backend Developer")).not.toBeInTheDocument();
  });
});
