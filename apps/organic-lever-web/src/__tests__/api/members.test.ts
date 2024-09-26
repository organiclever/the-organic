import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PUT, DELETE } from "../../app/api/members/route";
import { getDb } from "../../lib/db"; // Update this import

// Mock the configuration
vi.mock("@/config", () => ({
  config: {
    database: {
      url: ":memory:", // Use in-memory SQLite database for tests
    },
  },
}));

describe("Members API", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
    if (db) await db.exec("DELETE FROM members");
  });

  afterAll(async () => {
    if (db) await db.close();
  });

  it("should create a new member", async () => {
    const req = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe", github_account: "johndoe" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe("John Doe");
    expect(data.github_account).toBe("johndoe");
    expect(data.id).toBeDefined();
  });

  it("should get all members", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("should update a member", async () => {
    if (!db) throw new Error("Database connection failed");
    const members = await db.all("SELECT * FROM members");
    const memberId = members[0].id;

    const req = new NextRequest("http://localhost:3000/api/members", {
      method: "PUT",
      body: JSON.stringify({
        id: memberId,
        name: "Jane Doe",
        github_account: "janedoe",
      }),
    });

    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe("Jane Doe");
    expect(data.github_account).toBe("janedoe");
  });

  it("should delete a member", async () => {
    if (!db) throw new Error("Database connection failed");
    const members = await db.all("SELECT * FROM members");
    const memberId = members[0].id;

    const req = new NextRequest("http://localhost:3000/api/members", {
      method: "DELETE",
      body: JSON.stringify({ id: memberId }),
    });

    const res = await DELETE(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Member deleted successfully");
  });
});
