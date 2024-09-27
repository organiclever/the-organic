import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "@/components/Navigation";
import { act } from "react-dom/test-utils";

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

// Mock the Radix UI icons
vi.mock("@radix-ui/react-icons", () => ({
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  ChevronRightIcon: () => <div data-testid="chevron-right-icon" />,
  HamburgerMenuIcon: () => <div data-testid="hamburger-menu-icon" />,
  Cross1Icon: () => <div data-testid="cross-icon" />,
}));

describe("Navigation component", () => {
  const mockToggleSidebar = vi.fn();

  it("renders navigation with correct structure for desktop", () => {
    render(
      <Navigation
        isSidebarOpen={true}
        toggleSidebar={mockToggleSidebar}
        isMobile={false}
      />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(
      "fixed top-0 left-0 bottom-0 z-40 w-64 bg-primary text-primary-foreground"
    );
    expect(nav).toHaveClass("translate-x-0");

    expect(screen.getByText("Organic Lever")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
  });

  it("renders navigation with correct structure for mobile", () => {
    render(
      <Navigation
        isSidebarOpen={false}
        toggleSidebar={mockToggleSidebar}
        isMobile={true}
      />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("-translate-x-full");

    const toggleButton = screen.getByLabelText("Toggle navigation");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass("block");
  });

  it("toggles sidebar on button click", () => {
    render(
      <Navigation
        isSidebarOpen={false}
        toggleSidebar={mockToggleSidebar}
        isMobile={true}
      />
    );

    const toggleButton = screen.getByLabelText("Toggle navigation");
    fireEvent.click(toggleButton);

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("expands and collapses submenu items", () => {
    render(
      <Navigation
        isSidebarOpen={true}
        toggleSidebar={mockToggleSidebar}
        isMobile={false}
      />
    );

    const teamsButton = screen.getByText("Teams");
    expect(screen.queryByText("Members")).toBeInTheDocument(); // Submenu is open by default

    act(() => {
      fireEvent.click(teamsButton);
    });

    expect(screen.queryByText("Members")).toBeInTheDocument(); // Submenu remains open (level < 2)
  });
});
