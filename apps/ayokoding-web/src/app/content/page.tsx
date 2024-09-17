import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import ContentClient from "./ContentClient";

// ... (keep renderRichText, renderBlock, and renderBlocks functions as they were)

async function getNotionDataFromAPI(): Promise<BlockObjectResponse[]> {
  const response = await fetch("http://localhost:3000/api/notion-page", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Notion data from API");
  }
  return response.json();
}

export default async function ContentPage() {
  try {
    const notionBlocks = await getNotionDataFromAPI();
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
