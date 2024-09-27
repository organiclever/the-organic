import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MembersPage from "@/app/teams/management/members/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the next/link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

// Mock the API calls
vi.mock("@/lib/db", () => ({
  getDb: vi.fn(),
}));

// Mock the fetch function
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("MembersPage component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders the page title", () => {
    renderWithClient(<MembersPage />);
    expect(screen.getByText("Team Members")).toBeInTheDocument();
  });

  it("displays the add member form", () => {
    renderWithClient(<MembersPage />);
    expect(screen.getByText("Add New Member")).toBeInTheDocument();
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub ID *")).toBeInTheDocument();
  });

  it("displays the member list", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "1", name: "Alice Johnson", github_account: "alice_dev" },
      ],
    });

    renderWithClient(<MembersPage />);
    expect(screen.getByText("Member List")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
  });

  it("allows adding a new member", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "2",
        name: "New Member",
        github_account: "newmember_github",
      }),
    });

    renderWithClient(<MembersPage />);

    fireEvent.change(screen.getByLabelText("Name *"), {
      target: { value: "New Member" },
    });
    fireEvent.change(screen.getByLabelText("GitHub ID *"), {
      target: { value: "newmember_github" },
    });
    fireEvent.click(screen.getByText("Add Member"));

    await waitFor(() => {
      expect(screen.getByText("New Member")).toBeInTheDocument();
    });
  });

  it("allows deleting a member", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", name: "Alice Johnson", github_account: "alice_dev" },
          { id: "2", name: "Bob Smith", github_account: "bob_dev" },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    renderWithClient(<MembersPage />);

    await waitFor(() => {
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText("Delete member")[1]);

    await waitFor(() => {
      expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
    });
  });
});
