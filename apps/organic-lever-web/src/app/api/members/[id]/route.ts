import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  if (!db)
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  const member = await db.get("SELECT * FROM members WHERE id = ?", [
    params.id,
  ]);
  if (member) {
    return NextResponse.json(member);
  } else {
    return NextResponse.json({ message: "Member not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name, github_account } = await request.json();

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  try {
    await db.run(
      "UPDATE members SET name = ?, github_account = ? WHERE id = ?",
      [name, github_account, id]
    );
    return NextResponse.json({ id, name, github_account }, { status: 200 });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}
