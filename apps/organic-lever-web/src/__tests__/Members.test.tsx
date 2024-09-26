import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MemberList from "../components/MemberList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("MemberList component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the members list", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: "1", name: "Test Member", github_account: "testmember" },
        ]),
    });

    render(<MemberList />, { wrapper: createWrapper() });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Members/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Test Member/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/View/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
    expect(screen.getByText(/Add New Member/i)).toBeInTheDocument();
  });

  it("displays 'No members found' when the list is empty", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<MemberList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/No members found./i)).toBeInTheDocument();
    });
  });

  it("displays error message when fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    render(<MemberList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });
});
