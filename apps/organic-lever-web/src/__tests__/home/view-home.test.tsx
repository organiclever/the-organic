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
  FileText: () => <div data-testid="file-text-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
}));

describe("HomePage component", () => {
  it("renders the welcome message", () => {
    render(<HomePage />);
    const welcomeMessage = screen.getByText("Welcome to Organic Lever");
    expect(welcomeMessage).toBeInTheDocument();
    expect(welcomeMessage.tagName).toBe("H1");
    expect(welcomeMessage).toHaveClass("text-3xl font-bold mb-6 text-center");
  });

  it("renders the correct layout", () => {
    render(<HomePage />);
    const gridContainer = screen.getByText(
      "Welcome to Organic Lever"
    ).nextElementSibling;
    expect(gridContainer).toHaveClass(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    );
  });
});
