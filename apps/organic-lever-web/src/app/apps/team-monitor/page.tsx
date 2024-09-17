"use client";

import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

function JiraIssues() {
  const { isLoading, error, data } = useQuery("jiraIssues", async () => {
    const response = await fetch("/api/jira/issues?jql=project=MYPROJECT");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Jira Issues Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function TeamMonitor() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Welcome to Team Monitor Page</h1>
        <p>Hello from Organic Lever!</p>
        <JiraIssues />
      </div>
    </QueryClientProvider>
  );
}
