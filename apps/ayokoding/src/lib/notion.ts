import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getNotionData(
  blockId: string
): Promise<BlockObjectResponse[]> {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });
    return response.results as BlockObjectResponse[];
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    throw error;
  }
}
