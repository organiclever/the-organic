import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the JQL query parameter
  const { searchParams } = new URL(request.url);
  const jql = searchParams.get("jql");

  // Log the received JQL (optional, for debugging)
  console.log("Received JQL:", jql);

  // Response data with JQL included in the message
  const responseData = {
    data: { message: jql ? `JQL received: ${jql}` : "No JQL provided" },
    error_code: null,
  };

  // Return the response with 200 status code
  return NextResponse.json(responseData, { status: 200 });
}
