import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getNotionData() {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) {
    throw new Error("NOTION_PAGE_ID is not set");
  }

  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  return response.results as BlockObjectResponse[];
}

function renderRichText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join("");
}

function renderBlock(block: BlockObjectResponse): string {
  switch (block.type) {
    case "paragraph":
      return `<p>${renderRichText(block.paragraph.rich_text)}</p>`;
    case "heading_1":
      return `<h1>${renderRichText(block.heading_1.rich_text)}</h1>`;
    case "heading_2":
      return `<h2>${renderRichText(block.heading_2.rich_text)}</h2>`;
    case "heading_3":
      return `<h3>${renderRichText(block.heading_3.rich_text)}</h3>`;
    case "bulleted_list_item":
      return `<li>${renderRichText(block.bulleted_list_item.rich_text)}</li>`;
    case "numbered_list_item":
      return `<li>${renderRichText(block.numbered_list_item.rich_text)}</li>`;
    case "to_do":
      const checked = block.to_do.checked ? "checked" : "";
      return `<div><input type="checkbox" ${checked} disabled> ${renderRichText(
        block.to_do.rich_text
      )}</div>`;
    case "toggle":
      return `<details><summary>${renderRichText(
        block.toggle.rich_text
      )}</summary>${renderBlocks(
        block.toggle.children as BlockObjectResponse[]
      )}</details>`;
    case "child_page":
      return `<h3>${block.child_page.title}</h3>`;
    case "image":
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      return `<img src="${src}" alt="Notion image" />`;
    default:
      return "";
  }
}

function renderBlocks(blocks: BlockObjectResponse[]): string {
  let content = "";
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  blocks.forEach((block, index) => {
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const newListType = block.type === "bulleted_list_item" ? "ul" : "ol";
      if (!inList || listType !== newListType) {
        if (inList) {
          content += `</${listType}>`;
        }
        content += `<${newListType}>`;
        inList = true;
        listType = newListType;
      }
    } else if (inList) {
      content += `</${listType}>`;
      inList = false;
      listType = null;
    }

    content += renderBlock(block);

    if (inList && index === blocks.length - 1) {
      content += `</${listType}>`;
    }
  });

  return content;
}

export default async function ContentPage() {
  const notionBlocks = await getNotionData();
  const content = renderBlocks(notionBlocks);

  return (
    <div>
      <h1>Content from Notion</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
