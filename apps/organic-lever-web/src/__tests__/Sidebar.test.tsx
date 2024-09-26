import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "../components/Sidebar";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Sidebar component", () => {
  it("renders navigation items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Home")).toHaveAttribute("href", "/");
    expect(screen.getByText("Members")).toHaveAttribute("href", "/members");
  });
});
