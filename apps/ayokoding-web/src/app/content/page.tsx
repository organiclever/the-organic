"use client";

import { useState, useEffect } from "react";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderBlocks } from "@/utils/notionRenderer";

export const dynamic = "force-dynamic";

function ContentPage() {
  const [content, setContent] = useState<ReturnType<typeof renderBlocks>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotionData() {
      try {
        const response = await fetch("/api/notion-page");
        if (!response.ok) {
          throw new Error("Failed to fetch Notion data from API");
        }
        const notionBlocks: BlockObjectResponse[] = await response.json();
        console.log("Fetched blocks:", notionBlocks.length);

        if (notionBlocks.length === 0) {
          setError(
            "No content available. The page might be empty or inaccessible."
          );
          return;
        }

        const renderedContent = renderBlocks(notionBlocks);
        setContent(renderedContent);
      } catch (error) {
        console.error("Error in ContentPage:", error);
        setError(error instanceof Error ? error.message : String(error));
      }
    }

    fetchNotionData();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Content from Notion</h1>
        <p>Error loading content. Please try again later.</p>
        <p>Error details: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Content from Notion</h1>
      {content.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          {content.map((block) => (
            <div key={block.id}>
              {block.type === "paragraph" && <p>{block.content}</p>}
              {block.type === "heading_1" && <h1>{block.content}</h1>}
              {block.type === "heading_2" && <h2>{block.content}</h2>}
              {block.type === "heading_3" && <h3>{block.content}</h3>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContentPage;
