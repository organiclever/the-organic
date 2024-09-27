import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navigation from "@/components/Navigation";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Navigation component", () => {
  it("renders navigation with correct structure", () => {
    render(<Navigation />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("bg-primary text-primary-foreground p-4 mb-6");

    const ul = nav.querySelector("ul");
    expect(ul).toHaveClass("flex space-x-4 justify-center");
  });
});
