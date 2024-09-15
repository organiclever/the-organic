import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getNotionData } from "@/lib/notion";

const DATA_FILE = path.join(process.cwd(), "notion-data.json");

export async function GET() {
  try {
    const pageId = process.env.NOTION_PAGE_ID;
    if (!pageId) {
      throw new Error("NOTION_PAGE_ID is not set");
    }

    const notionData = await getNotionData(pageId);
    await fs.writeFile(DATA_FILE, JSON.stringify(notionData, null, 2));

    return NextResponse.json({ message: "Notion data refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing notion data:", error);
    return NextResponse.json(
      { error: "Failed to refresh data" },
      { status: 500 }
    );
  }
}
