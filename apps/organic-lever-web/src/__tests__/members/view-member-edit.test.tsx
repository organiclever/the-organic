import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditMemberPage from "../../app/members/[id]/edit/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useRouter: () => ({ push: vi.fn() }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe("EditMemberPage component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the edit form with member data", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "1",
          name: "Test Member",
          github_account: "testmember",
        }),
    });

    render(<EditMemberPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Edit Member/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Name/i)).toHaveValue("Test Member");
    expect(screen.getByLabelText(/GitHub Account/i)).toHaveValue("testmember");
  });

  it("submits the form with updated data", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "1",
            name: "Test Member",
            github_account: "testmember",
          }),
      })
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: "Member updated successfully" }),
      });

    render(<EditMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Edit Member/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Updated Member" },
    });
    fireEvent.change(screen.getByLabelText(/GitHub Account/i), {
      target: { value: "updatedmember" },
    });

    fireEvent.click(screen.getByText(/Update Member/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/members/1",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Updated Member",
            github_account: "updatedmember",
          }),
        })
      );
    });

    // Check that fetch was called multiple times due to query invalidations
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  it("displays error message when fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    render(<EditMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });
});
