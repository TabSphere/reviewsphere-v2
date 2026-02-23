import { NextResponse } from "next/server";
import { PLAN_CONFIG } from "@/lib/stripe/plans";

export const runtime = "nodejs";

export async function GET() {
  const result: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(PLAN_CONFIG)) {
    result[k] = !!v.priceId;
  }
  return NextResponse.json(result);
}
