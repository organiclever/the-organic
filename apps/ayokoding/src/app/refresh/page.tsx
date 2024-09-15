"use client";

import { useState } from "react";

export default function RefreshPage() {
  const [status, setStatus] = useState("");

  const refreshData = async () => {
    setStatus("Refreshing...");
    try {
      const response = await fetch("/api/notion-refresh");
      if (response.ok) {
        setStatus("Data refreshed successfully!");
      } else {
        setStatus("Failed to refresh data.");
      }
    } catch (error) {
      setStatus("Error refreshing data.");
    }
  };

  return (
    <div>
      <h1>Refresh Notion Data</h1>
      <button onClick={refreshData}>Refresh Data</button>
      <p>{status}</p>
    </div>
  );
}
