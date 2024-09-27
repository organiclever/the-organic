import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock the next/link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the Lucide React icons
vi.mock("lucide-react", () => ({
  Users: () => <div data-testid="users-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Database: () => <div data-testid="database-icon" />,
  BarChart2: () => <div data-testid="barchart2-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
}));

describe("HomePage component", () => {
  it("renders the dashboard title", () => {
    render(<HomePage />);
    const dashboardTitle = screen.getByText("Organic Lever Dashboard");
    expect(dashboardTitle).toBeInTheDocument();
    expect(dashboardTitle.tagName).toBe("H1");
    expect(dashboardTitle).toHaveClass("text-3xl font-bold mb-6");
  });

  it("renders the correct layout", () => {
    render(<HomePage />);
    const gridContainer = screen.getByText(
      "Organic Lever Dashboard"
    ).nextElementSibling;
    expect(gridContainer).toHaveClass("grid gap-6 md:grid-cols-2");
  });

  it("renders the Team Management card", () => {
    render(<HomePage />);
    expect(screen.getByText("Team Management")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your team structure and organization")
    ).toBeInTheDocument();
    const teamManagementButton = screen.getByText("Go to Team Management");
    expect(teamManagementButton).toBeInTheDocument();
    expect(teamManagementButton.closest("a")).toHaveAttribute("href", "/teams");
  });

  it("renders the Performance Tracking card", () => {
    render(<HomePage />);
    expect(screen.getByText("Performance Tracking")).toBeInTheDocument();
    expect(
      screen.getByText("Monitor and analyze team performance")
    ).toBeInTheDocument();
    const comingSoonButton = screen.getAllByText("Coming Soon")[0];
    expect(comingSoonButton).toBeInTheDocument();
    expect(comingSoonButton).toBeDisabled();
  });

  it("renders the Project Management card", () => {
    render(<HomePage />);
    expect(screen.getByText("Project Management")).toBeInTheDocument();
    expect(
      screen.getByText("Oversee and manage team projects")
    ).toBeInTheDocument();
    const comingSoonButton = screen.getAllByText("Coming Soon")[1];
    expect(comingSoonButton).toBeInTheDocument();
    expect(comingSoonButton).toBeDisabled();
  });

  it("renders the Settings card", () => {
    render(<HomePage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Configure application settings")
    ).toBeInTheDocument();

    const dbManagementButton = screen.getByText("Database Management");
    expect(dbManagementButton).toBeInTheDocument();
    expect(dbManagementButton.closest("a")).toHaveAttribute(
      "href",
      "/settings/db"
    );

    const generalSettingsButton = screen.getByText("General Settings");
    expect(generalSettingsButton).toBeInTheDocument();
    expect(generalSettingsButton).toBeDisabled();

    const userPreferencesButton = screen.getByText("User Preferences");
    expect(userPreferencesButton).toBeInTheDocument();
    expect(userPreferencesButton).toBeDisabled();
  });

  it("renders the correct icons", () => {
    render(<HomePage />);
    expect(screen.getAllByTestId("users-icon").length).toBe(2);
    expect(screen.getByTestId("barchart2-icon")).toBeInTheDocument();
    expect(screen.getByTestId("briefcase-icon")).toBeInTheDocument();
    expect(screen.getAllByTestId("settings-icon").length).toBe(2);
    expect(screen.getByTestId("database-icon")).toBeInTheDocument();
  });
});
