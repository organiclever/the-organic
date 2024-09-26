import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const db = await getDb();
  if (!db)
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  const members = await db.all("SELECT * FROM members");
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const { name, github_account } = await request.json();
  const id = uuidv4();
  const db = await getDb();
  if (!db)
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  await db.run(
    "INSERT INTO members (id, name, github_account) VALUES (?, ?, ?)",
    [id, name, github_account]
  );
  return NextResponse.json({ id, name, github_account }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, name, github_account } = await request.json();
  const db = await getDb();
  if (!db)
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  await db.run("UPDATE members SET name = ?, github_account = ? WHERE id = ?", [
    name,
    github_account,
    id,
  ]);
  return NextResponse.json({ id, name, github_account });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const db = await getDb();
  if (!db)
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  await db.run("DELETE FROM members WHERE id = ?", [id]);
  return NextResponse.json({ message: "Member deleted successfully" });
}
