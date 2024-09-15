import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getNotionData } from "@/lib/notion";

const DATA_FILE = path.join(process.cwd(), "notion-data.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading notion data file:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
