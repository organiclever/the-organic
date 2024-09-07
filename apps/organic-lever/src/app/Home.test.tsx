import { render, screen } from "@testing-library/react";
import Home from "./page";

// Mock the @libs/hello module
jest.mock("@libs/hello", () => ({
  hello: (name: string) => `Hello, ${name}!`,
}));

describe("Home", () => {
  it("renders the main heading with greeting from hello library", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /Hello, Organic Lever!/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
