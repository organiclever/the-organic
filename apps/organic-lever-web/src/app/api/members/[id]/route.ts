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
