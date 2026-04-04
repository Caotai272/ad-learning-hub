import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      status: "ok",
      phase: 1,
      service: "ad-learning-hub",
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
    error: null,
  });
}
