import { NextRequest, NextResponse } from "next/server";
import { createDuffelLink } from "@/adapters/duffel/client";

export async function GET(request: NextRequest) {
  const offerId = request.nextUrl.searchParams.get("offer_id");

  if (!offerId || offerId.length === 0) {
    return NextResponse.json(
      { error: "offer_id is required" },
      { status: 400 }
    );
  }

  const apiToken = process.env.DUFFEL_API_TOKEN ?? "";
  if (apiToken.length === 0) {
    return NextResponse.json(
      { error: "Duffel API not configured" },
      { status: 503 }
    );
  }

  try {
    const bookingUrl = await createDuffelLink(offerId, apiToken);
    return NextResponse.redirect(bookingUrl);
  } catch (error) {
    console.error("Duffel booking link error:", error);
    return NextResponse.json(
      { error: "Failed to create booking link" },
      { status: 500 }
    );
  }
}
