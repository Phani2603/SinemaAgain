# TMDB API Reference Documentation Summary

## Overview
This document summarizes the key information from The Movie Database (TMDB) API v3 reference documentation.
Source: https://developer.themoviedb.org/reference/getting-started

## API Version
- **Current Version**: v3 (Version 3 of The Movie Database API)
- **Base URL**: https://api.themoviedb.org/3/

## Authentication & Credentials
- **API Key Required**: You need to get an API key from developer.themoviedb.org
- **Header Authentication**: Uses 'accept: application/json' header
- **Endpoint for Key Validation**: `/authentication` - validates your API key

## Core Data Categories

### 1. Movies
**Popular Endpoints:**
- Now Playing: `/movie/now-playing-list` (GET)
- Popular: `/movie/popular-list` (GET)  
- Top Rated: `/movie/top-rated-list` (GET)
- Upcoming: `/movie/upcoming-list` (GET)
- Latest: `/movie/latest-id` (GET)

**Movie Details & Metadata:**
- Details: `/movie/details` (GET)
- Alternative Titles: `/movie/alternative-titles` (GET)
- Credits: `/movie/credits` (GET)
- External IDs: `/movie/external-ids` (GET)
- Images: `/movie/images` (GET)
- Keywords: `/movie/keywords` (GET)
- Lists: `/movie/lists` (GET)
- Recommendations: `/movie/recommendations` (GET)
- Release Dates: `/movie/release-dates` (GET)
- Reviews: `/movie/reviews` (GET)
- Similar: `/movie/similar` (GET)
- Translations: `/movie/translations` (GET)
- Videos: `/movie/videos` (GET)
- Watch Providers: `/movie/watch-providers` (GET)

**Movie Interactions:**
- Add Rating: `/movie/add-rating` (POST)
- Delete Rating: `/movie/delete-rating` (DELETE)
- Account States: `/movie/account-states` (GET)
- Changes: `/movie/changes` (GET)

### 2. TV Shows/Series
**Popular Endpoints:**
- Airing Today: `/tv-series-airing-today-list` (GET)
- On The Air: `/tv-series-on-the-air-list` (GET)
- Popular: `/tv-series-popular-list` (GET)
- Top Rated: `/tv-series-top-rated-list` (GET)
- Latest: `/tv-series-latest-id` (GET)

**TV Series Details:**
- Details: `/tv-series-details` (GET)
- Account States: `/tv-series-account-states` (GET)
- Aggregate Credits: `/tv-series-aggregate-credits` (GET)
- Alternative Titles: `/tv-series-alternative-titles` (GET)
- Changes: `/tv-series-changes` (GET)
- Content Ratings: `/tv-series-content-ratings` (GET)
- Credits: `/tv-series-credits` (GET)
- Episode Groups: `/tv-series-episode-groups` (GET)
- External IDs: `/tv-series-external-ids` (GET)
- Images: `/tv-series-images` (GET)
- Keywords: `/tv-series-keywords` (GET)
- Lists: `/lists-copy` (GET)
- Recommendations: `/tv-series-recommendations` (GET)
- Reviews: `/tv-series-reviews` (GET)
- Screened Theatrically: `/tv-series-screened-theatrically` (GET)
- Similar: `/tv-series-similar` (GET)
- Translations: `/tv-series-translations` (GET)
- Videos: `/tv-series-videos` (GET)
- Watch Providers: `/tv-series-watch-providers` (GET)

**TV Interactions:**
- Add Rating: `/tv-series-add-rating` (POST)
- Delete Rating: `/tv-series-delete-rating` (DELETE)

### 3. TV Seasons
- Details: `/tv-season-details` (GET)
- Account States: `/tv-season-account-states` (GET)
- Aggregate Credits: `/tv-season-aggregate-credits` (GET)
- Changes: `/tv-season-changes-by-id` (GET)
- Credits: `/tv-season-credits` (GET)
- External IDs: `/tv-season-external-ids` (GET)
- Images: `/tv-season-images` (GET)
- Translations: `/tv-season-translations` (GET)
- Videos: `/tv-season-videos` (GET)
- Watch Providers: `/tv-season-watch-providers` (GET)

### 4. TV Episodes
- Details: `/tv-episode-details` (GET)
- Account States: `/tv-episode-account-states` (GET)
- Changes: `/tv-episode-changes-by-id` (GET)
- Credits: `/tv-episode-credits` (GET)
- External IDs: `/tv-episode-external-ids` (GET)
- Images: `/tv-episode-images` (GET)
- Translations: `/tv-episode-translations` (GET)
- Videos: `/tv-episode-videos` (GET)
- Add Rating: `/tv-episode-add-rating` (POST)
- Delete Rating: `/tv-episode-delete-rating` (DELETE)

### 5. People/Actors
- Popular: `/person-popular-list` (GET)
- Details: `/person-details` (GET)
- Changes: `/person-changes` (GET)
- Combined Credits: `/person-combined-credits` (GET)
- External IDs: `/person-external-ids` (GET)
- Images: `/person-images` (GET)
- Latest: `/person-latest-id` (GET)
- Movie Credits: `/person-movie-credits` (GET)
- TV Credits: `/person-tv-credits` (GET)
- Tagged Images: `/person-tagged-images` (GET) [Deprecated]
- Translations: `/translations` (GET)

### 6. Search Functionality
- Collection Search: `/search-collection` (GET)
- Company Search: `/search-company` (GET)
- Keyword Search: `/search-keyword` (GET)
- Movie Search: `/search-movie` (GET)
- Multi Search: `/search-multi` (GET)
- Person Search: `/search-person` (GET)
- TV Search: `/search-tv` (GET)

### 7. Discover
- Discover Movies: `/discover-movie` (GET)
- Discover TV: `/discover-tv` (GET)

### 8. Trending
- All Trending: `/trending-all` (GET)
- Trending Movies: `/trending-movies` (GET)
- Trending People: `/trending-people` (GET)
- Trending TV: `/trending-tv` (GET)

### 9. Genres
- Movie Genre List: `/genre-movie-list` (GET)
- TV Genre List: `/genre-tv-list` (GET)

### 10. Configuration & Metadata
- Configuration Details: `/configuration-details` (GET)
- Countries: `/configuration-countries` (GET)
- Jobs: `/configuration-jobs` (GET)
- Languages: `/configuration-languages` (GET)
- Primary Translations: `/configuration-primary-translations` (GET)
- Timezones: `/configuration-timezones` (GET)

### 11. User Account Features
**Account Management:**
- Account Details: `/account-details` (GET)
- Add Favorite: `/account-add-favorite` (POST)
- Add To Watchlist: `/account-add-to-watchlist` (POST)
- Favorite Movies: `/account-get-favorites` (GET)
- Favorite TV: `/account-favorite-tv` (GET)
- Account Lists: `/account-lists` (GET)
- Rated Movies: `/account-rated-movies` (GET)
- Rated TV: `/account-rated-tv` (GET)
- Rated TV Episodes: `/account-rated-tv-episodes` (GET)
- Watchlist Movies: `/account-watchlist-movies` (GET)
- Watchlist TV: `/account-watchlist-tv` (GET)

### 12. Authentication System
**Session Management:**
- Create Guest Session: `/authentication-create-guest-session` (GET)
- Create Request Token: `/authentication-create-request-token` (GET)
- Create Session: `/authentication-create-session` (POST)
- Create Session from v4 Token: `/authentication-create-session-from-v4-token` (POST)
- Create Session with Login: `/authentication-create-session-from-login` (POST)
- Delete Session: `/authentication-delete-session` (DELETE)
- Validate Key: `/authentication-validate-key` (GET)

**Guest Session Features:**
- Guest Session Rated Movies: `/guest-session-rated-movies` (GET)
- Guest Session Rated TV: `/guest-session-rated-tv` (GET)
- Guest Session Rated TV Episodes: `/guest-session-rated-tv-episodes` (GET)

### 13. Lists Management
**List Operations:**
- Add Movie to List: `/list-add-movie` (POST)
- Check Item Status: `/list-check-item-status` (GET)
- Clear List: `/list-clear` (POST)
- Create List: `/list-create` (POST)
- Delete List: `/list-delete` (DELETE)
- List Details: `/list-details` (GET)
- Remove Movie from List: `/list-remove-movie` (POST)

### 14. Additional Features
**Companies:**
- Company Details: `/company-details` (GET)
- Company Alternative Names: `/company-alternative-names` (GET)
- Company Images: `/company-images` (GET)

**Collections:**
- Collection Details: `/collection-details` (GET)
- Collection Images: `/collection-images` (GET)
- Collection Translations: `/collection-translations` (GET)

**Watch Providers:**
- Available Regions: `/watch-providers-available-regions` (GET)
- Movie Providers: `/watch-providers-movie-list` (GET)
- TV Providers: `/watch-provider-tv-list` (GET)

**Certifications:**
- Movie Certifications: `/certification-movie-list` (GET)
- TV Certifications: `/certifications-tv-list` (GET)

**Changes Tracking:**
- Movie Changes List: `/changes-movie-list` (GET)
- People Changes List: `/changes-people-list` (GET)
- TV Changes List: `/changes-tv-list` (GET)

**Keywords & Reviews:**
- Keyword Details: `/keyword-details` (GET)
- Keyword Movies: `/keyword-movies` (GET) [Deprecated]
- Review Details: `/review-details` (GET)

**Networks:**
- Network Details: `/network-details` (GET)
- Network Alternative Names: `/details-copy` (GET)
- Network Images: `/alternative-names-copy` (GET)

**Find External:**
- Find by External ID: `/find-by-id` (GET)

**Credits:**
- Credit Details: `/credit-details` (GET)

**TV Episode Groups:**
- Episode Group Details: `/tv-episode-group-details` (GET)

## API Response Format
- **Content Type**: application/json
- **HTTP Status Codes**: 
  - 200: Success
  - 401: Unauthorized (likely API key issue)

## Usage Notes
- The API supports multiple programming languages (Shell, Node, Ruby, PHP, Python, Java, C#, etc.)
- Interactive "Try It!" feature available for testing endpoints
- Popular endpoints from the last 30 days are tracked and displayed
- Some endpoints are marked as deprecated (should be avoided)
- The API supports both v3 and v4 list functionality

## Rate Limiting & Best Practices
- Specific rate limits not mentioned in the getting started page
- Authentication required for most endpoints
- Session-based authentication available for user-specific features

## Additional Resources
- Guides: https://developer.themoviedb.org/docs
- Full API Reference: https://developer.themoviedb.org/reference
- Authentication Documentation: https://developer.themoviedb.org/reference/authentication

## Key Features for Our SinemaAgain Project
Based on our current implementation, we're primarily using:
1. **Movie Discovery**: Popular, Top Rated, Now Playing, Upcoming
2. **Movie Details**: Full movie information with videos and credits
3. **Search**: Movie search functionality
4. **Genres**: Movie genre classification
5. **Person Details**: Actor/director information
6. **Images**: Movie posters and backdrops

## API Versioning Notes
- This documentation covers v3 of the API
- There's mention of v4 tokens and compatibility
- Some endpoints have v3 vs v4 considerations (particularly for lists)

## Important Considerations
- The API appears to be well-maintained with regular updates
- Extensive endpoint coverage for movies, TV shows, and people
- Strong support for user account features and personalization
- Comprehensive metadata including images, videos, translations
- Good international support with multiple languages and regions