import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DiscoverParams {
  with_original_language?: string;
  with_origin_country?: string;
  region?: string;
  with_genres?: string;
  sort_by?: string;
  page?: number;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "vote_count.gte"?: number;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
}

async function fetchTMDBDiscover(params: DiscoverParams, retries = 3) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY || "",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${TMDB_BASE_URL}/discover/movie?${queryParams}`;
  
  // DEBUG: Log the request URL
  console.log("🎬 TMDB Request URL:", url);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      // DEBUG: Log response status
      console.log("📡 TMDB Response Status:", response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("❌ TMDB Error Response:", errorBody);
        throw new Error(`TMDB API error: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      
      // DEBUG: Log result count
      console.log("✅ TMDB Results:", data.results?.length || 0, "movies");
      
      return data;
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt === retries) {
        throw error; // Last attempt failed, throw error
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error("Failed to fetch from TMDB after retries");
}

/**
 * GET /api/your-space
 * Fetch personalized movies based on user preferences
 * Filters by: region, primary language, favorite genres
 */
export async function GET(request: NextRequest) {
  try {
    // DEBUG: Check API key
    if (!TMDB_API_KEY) {
      console.error("❌ TMDB_API_KEY is not set!");
      return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user preferences
    const region = user.preferences?.region || "IN";
    const primaryLanguage = user.preferences?.languages?.find(
      (l: { code: string; name: string; isPrimary: boolean }) => l.isPrimary
    );
    const languageCode = primaryLanguage?.code || "en";
    const favoriteGenres = user.preferences?.favoriteGenres || [];

    // Get section type from query params
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "popular";
    
    // Check for custom filters (from advanced filter)
    const customRegion = searchParams.get("region");
    const customLanguage = searchParams.get("language");
    const customGenres = searchParams.get("genres");
    const customSortBy = searchParams.get("sort_by");
    const timeFrame = searchParams.get("timeFrame"); // year, month, all-time

    // Use custom filters if provided, otherwise use user preferences
    const finalRegion = customRegion || region;
    const finalLanguage = customLanguage || languageCode;
    const finalGenres = customGenres ? customGenres.split(",").map(Number) : favoriteGenres;
    const finalSortBy = customSortBy || undefined;

    // REMOVED CACHING - Direct fetch for better UX when switching tabs
    // const cacheKey = `your-space:${user._id}:${section}:${finalRegion}:${finalLanguage}:${finalGenres.join(",")}`;
    // const movies = await getCached(cacheKey, TTL.THIRTY_MINUTES, async () => { ... });

    // DEBUG: Log user preferences
    console.log("👤 User Preferences:", {
      region: finalRegion,
      languageCode: finalLanguage,
      favoriteGenres: finalGenres,
      section,
    });

    const baseParams: DiscoverParams = {
      with_original_language: finalLanguage,
      region: finalRegion, // Add region for regional release dates/popularity
    };

    // Add genre filter for custom filtered searches
    if (section === "filtered" && finalGenres.length > 0) {
      // Use pipe-separated genres for OR logic (any genre matches)
      // TMDB API: comma-separated = AND logic, pipe-separated = OR logic
      baseParams.with_genres = finalGenres.join("|");
      console.log("🎯 Genre filter (OR logic - any genre matches):", baseParams.with_genres);
    } else {
      // TEMPORARILY DISABLED: Genre filtering to get more results for default sections
      console.log("🎯 Genre filter: DISABLED (default sections)");
    }

    // Section-specific sorting
    let movies;
    switch (section) {
      case "new-releases":
        // Movies ALREADY RELEASED in the last 60 days (exclude unreleased)
        const today = new Date().toISOString().split("T")[0];
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const releaseDate = sixtyDaysAgo.toISOString().split("T")[0];
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: "primary_release_date.desc",
          "primary_release_date.gte": releaseDate,
          "primary_release_date.lte": today,
        });
        break;

      case "top-new-releases":
        // Top-rated movies from last 90 days (min 50 votes for quality)
        const todayTopNew = new Date().toISOString().split("T")[0];
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const topNewReleaseDate = ninetyDaysAgo.toISOString().split("T")[0];
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: "vote_average.desc",
          "primary_release_date.gte": topNewReleaseDate,
          "primary_release_date.lte": todayTopNew,
          "vote_count.gte": 50,
        });
        break;

      case "upcoming":
        // Movies releasing in next 180 days
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 180);
        const maxDate = futureDate.toISOString().split("T")[0];
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: "primary_release_date.asc",
          "primary_release_date.gte": tomorrowStr,
          "primary_release_date.lte": maxDate,
        });
        break;

      case "popular":
      default:
        // Popular ALREADY RELEASED movies only
        const todayForPopular = new Date().toISOString().split("T")[0];
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: finalSortBy || "popularity.desc",
          "primary_release_date.lte": todayForPopular,
        });
        break;
        
      case "filtered":
        // Custom filtered search with advanced filters
        const todayForFiltered = new Date().toISOString().split("T")[0];
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: finalSortBy || "popularity.desc",
          "primary_release_date.lte": todayForFiltered,
        });
        break;

      case "box-office":
        // Box Office hits by time frame (using popularity + vote_count as proxy)
        const todayBoxOffice = new Date().toISOString().split("T")[0];
        let boxOfficeStartDate: string;
        
        switch (timeFrame) {
          case "month":
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            boxOfficeStartDate = oneMonthAgo.toISOString().split("T")[0];
            break;
          case "year":
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            boxOfficeStartDate = oneYearAgo.toISOString().split("T")[0];
            break;
          case "all-time":
          default:
            boxOfficeStartDate = "1900-01-01"; // All movies ever
            break;
        }
        
        movies = await fetchTMDBDiscover({
          ...baseParams,
          sort_by: "popularity.desc",
          "primary_release_date.gte": boxOfficeStartDate,
          "primary_release_date.lte": todayBoxOffice,
          "vote_count.gte": 100, // High engagement = likely box office hit
        });
        break;
    }

    return NextResponse.json(
      {
        section,
        region: finalRegion,
        language: finalLanguage,
        languageName: primaryLanguage?.name || "English",
        genres: finalGenres,
        movies: movies.results || [],
        total_results: movies.total_results || 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );

  } catch (error) {
    console.error("Your Space API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
