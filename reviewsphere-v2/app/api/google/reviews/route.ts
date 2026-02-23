import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Stub for fetching Google Business reviews. Requires OAuth and API access.
  return NextResponse.json({
    error: "NOT_CONFIGURED",
    message: "Google Reviews fetch is not configured. Implement OAuth and call Google Business Profile API to retrieve reviews.",
  }, { status: 501 });
}
