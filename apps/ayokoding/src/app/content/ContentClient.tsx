"use client";

import { useEffect } from "react";

export default function ContentClient({ rawData }: { rawData: string }) {
  useEffect(() => {
    console.log("Raw Notion Response:", JSON.parse(rawData));
  }, [rawData]);

  return null;
}
