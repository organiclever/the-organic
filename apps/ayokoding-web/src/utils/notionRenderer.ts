import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface RenderedBlock {
  type: string;
  id: string;
  content: string;
}

export function renderBlocks(blocks: BlockObjectResponse[]): RenderedBlock[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        return {
          type: "paragraph",
          id: block.id,
          content: block.paragraph.rich_text[0]?.plain_text || "",
        };
      case "heading_1":
        return {
          type: "heading_1",
          id: block.id,
          content: block.heading_1.rich_text[0]?.plain_text || "",
        };
      case "heading_2":
        return {
          type: "heading_2",
          id: block.id,
          content: block.heading_2.rich_text[0]?.plain_text || "",
        };
      case "heading_3":
        return {
          type: "heading_3",
          id: block.id,
          content: block.heading_3.rich_text[0]?.plain_text || "",
        };
      // Add more cases for other block types as needed
      default:
        return {
          type: "unsupported",
          id: block.id,
          content: "",
        };
    }
  });
}
