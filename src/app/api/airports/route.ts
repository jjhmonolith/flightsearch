import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/lib/airports";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (query.length === 0) {
    return NextResponse.json({ airports: [] });
  }

  const airports = searchAirports(query, 8);
  return NextResponse.json({ airports });
}
