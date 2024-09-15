import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import ContentClient from "./ContentClient";

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getNotionData(blockId: string): Promise<BlockObjectResponse[]> {
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

function renderRichText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join("");
}

function renderBlock(block: BlockObjectResponse, depth: number = 0): string {
  let content = "";
  const indent = "  ".repeat(depth); // 2 spaces per depth level

  switch (block.type) {
    case "paragraph":
      content = `<p>${renderRichText(block.paragraph.rich_text)}</p>`;
      break;
    case "heading_1":
      content = `<h1>${renderRichText(block.heading_1.rich_text)}</h1>`;
      break;
    case "heading_2":
      content = `<h2>${renderRichText(block.heading_2.rich_text)}</h2>`;
      break;
    case "heading_3":
      content = `<h3>${renderRichText(block.heading_3.rich_text)}</h3>`;
      break;
    case "bulleted_list_item":
      content = `<li>${renderRichText(block.bulleted_list_item.rich_text)}${
        block.children ? renderBlocks(block.children, depth + 1) : ""
      }</li>`;
      break;
    case "numbered_list_item":
      content = `<li>${renderRichText(block.numbered_list_item.rich_text)}${
        block.children ? renderBlocks(block.children, depth + 1) : ""
      }</li>`;
      break;
    case "to_do":
      const checked = block.to_do.checked ? "checked" : "";
      content = `<div><input type="checkbox" ${checked} disabled> ${renderRichText(
        block.to_do.rich_text
      )}${block.children ? renderBlocks(block.children, depth + 1) : ""}</div>`;
      break;
    case "toggle":
      content = `<details><summary>${renderRichText(
        block.toggle.rich_text
      )}</summary>${
        block.children ? renderBlocks(block.children, depth + 1) : ""
      }</details>`;
      break;
    case "child_page":
      content = `<h3><a href="/content/${block.id}">${block.child_page.title}</a></h3>`;
      break;
    case "image":
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      content = `<img src="${src}" alt="Notion image" />`;
      break;
    case "link_to_page":
      if (block.link_to_page.type === "page_id") {
        content = `<p><a href="/content/${block.link_to_page.page_id}">Link to page</a></p>`;
      } else if (block.link_to_page.type === "database_id") {
        content = `<p><a href="/content/${block.link_to_page.database_id}">Link to database</a></p>`;
      } else {
        content = `<p>Unsupported link type</p>`;
      }
      break;
    case "divider":
      content = `<hr />`;
      break;
    default:
      content = `<p>Unsupported block type: ${block.type}</p>`;
  }
  return `${indent}<div style="margin-left: ${
    depth * 20
  }px;">${content} - <span style="color: gray; font-size: 0.8em;">${
    block.type
  }</span></div>`;
}

function renderBlocks(
  blocks: BlockObjectResponse[],
  depth: number = 0
): string {
  let content = "";
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  const indent = "  ".repeat(depth); // 2 spaces per depth level

  blocks.forEach((block, index) => {
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const newListType = block.type === "bulleted_list_item" ? "ul" : "ol";
      if (!inList || listType !== newListType) {
        if (inList) {
          content += `${indent}</${listType}>`;
        }
        content += `${indent}<${newListType} style="margin-left: ${
          depth * 20
        }px;">`;
        inList = true;
        listType = newListType;
      }
    } else if (inList) {
      content += `${indent}</${listType}>`;
      inList = false;
      listType = null;
    }

    content += renderBlock(block, depth);

    if (inList && index === blocks.length - 1) {
      content += `${indent}</${listType}>`;
    }
  });

  return content;
}

export default async function ContentPage() {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) {
    throw new Error("NOTION_PAGE_ID is not set");
  }

  try {
    const notionBlocks = await getNotionData(pageId);
    console.log("Fetched blocks:", notionBlocks.length);

    if (notionBlocks.length === 0) {
      return (
        <div>
          <h1>Content from Notion</h1>
          <p>No content available. The page might be empty or inaccessible.</p>
        </div>
      );
    }

    const content = renderBlocks(notionBlocks);

    return (
      <div>
        <h1>Content from Notion</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <ContentClient rawData={JSON.stringify(notionBlocks)} />
      </div>
    );
  } catch (error) {
    console.error("Error in ContentPage:", error);
    return (
      <div>
        <h1>Content from Notion</h1>
        <p>Error loading content. Please try again later.</p>
        <p>
          Error details:{" "}
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }
}
