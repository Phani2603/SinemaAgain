/**
 * Constants for regions, languages, and movie genres
 */

export const REGIONS = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
] as const;

export const LANGUAGES = [
  // Indian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  // International
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
] as const;

/**
 * TMDB Genre IDs
 * Reference: https://developer.themoviedb.org/reference/genre-movie-list
 */
export const GENRES = [
  { id: 28, name: 'Action', icon: '💥' },
  { id: 12, name: 'Adventure', icon: '🗺️' },
  { id: 16, name: 'Animation', icon: '🎨' },
  { id: 35, name: 'Comedy', icon: '😂' },
  { id: 80, name: 'Crime', icon: '🔫' },
  { id: 99, name: 'Documentary', icon: '📽️' },
  { id: 18, name: 'Drama', icon: '🎭' },
  { id: 10751, name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 14, name: 'Fantasy', icon: '🧙' },
  { id: 36, name: 'History', icon: '📜' },
  { id: 27, name: 'Horror', icon: '👻' },
  { id: 10402, name: 'Music', icon: '🎵' },
  { id: 9648, name: 'Mystery', icon: '🔍' },
  { id: 10749, name: 'Romance', icon: '❤️' },
  { id: 878, name: 'Science Fiction', icon: '🚀' },
  { id: 10770, name: 'TV Movie', icon: '📺' },
  { id: 53, name: 'Thriller', icon: '😱' },
  { id: 10752, name: 'War', icon: '⚔️' },
  { id: 37, name: 'Western', icon: '🤠' },
] as const;

export const MAX_FAVORITE_GENRES = 5;
export const MAX_LANGUAGES = 5;
