import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { name: /Hello, AyoKoding!/i });
    expect(heading).toBeInTheDocument();
  });
});
