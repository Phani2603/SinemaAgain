import { tmdbApi } from "@/lib/tmdb-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  
  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }
  
  try {
    const results = await tmdbApi.searchMovies(query, 1);
    
    return NextResponse.json({
      results: results.results,
      total_results: results.total_results,
      total_pages: results.total_pages,
    });
  } catch (error) {
    console.error("Error searching movies:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}