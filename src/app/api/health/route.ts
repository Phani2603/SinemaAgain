import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';

export async function GET() {
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'checking',
        tmdb: 'checking',
        auth: 'checking'
      }
    };

    // Database health check
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        healthCheck.checks.database = 'healthy';
      } else {
        healthCheck.checks.database = 'not-configured';
      }
    } catch {
      healthCheck.checks.database = 'unhealthy';
    }

    // TMDB API health check
    try {
      if (process.env.TMDB_READ_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN) {
        const token = process.env.TMDB_READ_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN;
        const response = await fetch('https://api.themoviedb.org/3/configuration', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          healthCheck.checks.tmdb = 'healthy';
        } else {
          healthCheck.checks.tmdb = 'unhealthy';
        }
      } else {
        healthCheck.checks.tmdb = 'not-configured';
      }
    } catch {
      healthCheck.checks.tmdb = 'unhealthy';
    }

    // Auth configuration check
    try {
      if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
        healthCheck.checks.auth = 'healthy';
      } else {
        healthCheck.checks.auth = 'not-configured';
      }
    } catch {
      healthCheck.checks.auth = 'unhealthy';
    }

    // Overall health status
    const allHealthy = Object.values(healthCheck.checks).every(
      check => check === 'healthy' || check === 'not-configured'
    );

    if (!allHealthy) {
      healthCheck.status = 'degraded';
    }

    return NextResponse.json(healthCheck, {
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// Add other HTTP methods for completeness
export async function HEAD() {
  try {
    await connectToDatabase();
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}