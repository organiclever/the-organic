import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MembersPage from "../app/members/page";

vi.mock("@libs/hello", () => ({
  hello: (name: string) => `Hello, ${name}!`,
}));

describe("MembersPage component", () => {
  it("renders the hello message for members", () => {
    render(<MembersPage />);
    const helloMessage = screen.getByText(/Hello, Members!/i);
    expect(helloMessage).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to the members page!/i)
    ).toBeInTheDocument();
  });
});
