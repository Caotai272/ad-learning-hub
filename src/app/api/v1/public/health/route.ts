import { NextResponse } from "next/server";

import { getSystemHealthSnapshot } from "@/server/health";

export async function GET() {
  const snapshot = await getSystemHealthSnapshot();

  return NextResponse.json(
    {
      data: snapshot,
      meta: {
        timestamp: new Date().toISOString(),
      },
      error: null,
    },
    {
      status: snapshot.status === "down" ? 503 : 200,
    },
  );
}
