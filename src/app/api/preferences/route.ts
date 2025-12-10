import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { cache } from "@/lib/cache";

/**
 * GET /api/preferences
 * Get user preferences (region, languages, favorite genres)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      region: user.preferences.region || 'IN',
      languages: user.preferences.languages || [],
      favoriteGenres: user.preferences.favoriteGenres || [],
    });

  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/preferences
 * Update user preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { region, languages, favoriteGenres } = body;

    // Validation
    if (languages && languages.length > 5) {
      return NextResponse.json({ error: "Maximum 5 languages allowed" }, { status: 400 });
    }

    if (favoriteGenres && favoriteGenres.length > 5) {
      return NextResponse.json({ error: "Maximum 5 favorite genres allowed" }, { status: 400 });
    }

    // Ensure only one primary language
    if (languages) {
      const primaryCount = languages.filter((l: { isPrimary: boolean }) => l.isPrimary).length;
      if (primaryCount > 1) {
        return NextResponse.json({ error: "Only one primary language allowed" }, { status: 400 });
      }
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize preferences object if it doesn't exist
    if (!user.preferences) {
      user.preferences = {
        genres: [],
        watchProviders: [],
        language: 'en',
        region: 'IN',
        languages: [],
        favoriteGenres: []
      };
    }

    // Update preferences
    if (region !== undefined) {
      user.preferences.region = region;
    }
    if (languages !== undefined) {
      user.preferences.languages = languages;
    }
    if (favoriteGenres !== undefined) {
      user.preferences.favoriteGenres = favoriteGenres;
    }

    // Mark nested object as modified for Mongoose
    user.markModified('preferences');
    await user.save();

    // Invalidate profile cache
    cache.invalidate(`profile:${user._id}`);

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: {
        region: user.preferences.region,
        languages: user.preferences.languages,
        favoriteGenres: user.preferences.favoriteGenres,
      },
    });

  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
