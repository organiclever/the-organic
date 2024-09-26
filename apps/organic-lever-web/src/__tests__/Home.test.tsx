import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

// Mock the @libs/hello module
vi.mock("@libs/hello", () => ({
  hello: (name: string) => `Hello, ${name}!`,
}));

describe("Home component", () => {
  it("renders the hello message", () => {
    render(<Home />);
    const helloMessage = screen.getByText(/Hello, Organic Lever!/i);
    expect(helloMessage).toBeInTheDocument();
  });
});
