import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Validate that the URL is from oneearth.org to prevent abuse
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; hypercerts/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch KML: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const kmlContent = await response.text();

    return new NextResponse(kmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.google-earth.kml+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching KML:", error);
    return NextResponse.json(
      { error: "Failed to fetch KML file" },
      { status: 500 }
    );
  }
}
