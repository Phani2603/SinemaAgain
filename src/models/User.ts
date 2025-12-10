import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  image?: string;
  password?: string;
  watchlist: number[];
  favorites: number[];
  preferences: {
    genres: string[];
    watchProviders: string[];
    language: string;
  };
  profile: {
    bio?: string;
    favoriteGenres: string[];
    favoriteMovies: number[];
  };
  socialStats: {
    reviewsCount: number;
    friendsCount: number;
    watchlistCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  image: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    minlength: 6,
  },
  watchlist: [{
    type: Number, // TMDB movie IDs
    required: true,
  }],
  favorites: [{
    type: Number, // TMDB movie IDs
    required: true,
  }],
  preferences: {
    genres: [{
      type: String,
      enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Adventure'],
    }],
    watchProviders: [{
      type: String,
      enum: ['Netflix', 'Prime Video', 'Disney+', 'Hulu', 'HBO Max', 'Apple TV+', 'Paramount+', 'Peacock'],
    }],
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it'],
    },
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500,
    },
    favoriteGenres: [String],
    favoriteMovies: [Number],
  },
  socialStats: {
    reviewsCount: { type: Number, default: 0 },
    friendsCount: { type: Number, default: 0 },
    watchlistCount: { type: Number, default: 0 },
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Middleware to update stats
UserSchema.pre('save', function(next) {
  this.socialStats.watchlistCount = this.watchlist.length;
  // friendsCount is managed by friendship operations in API routes
  next();
});

// Instance methods
UserSchema.methods.addToWatchlist = function(movieId: number) {
  if (!this.watchlist.includes(movieId)) {
    this.watchlist.push(movieId);
  }
  return this.save();
};

UserSchema.methods.removeFromWatchlist = function(movieId: number) {
  this.watchlist = this.watchlist.filter((id: number) => id !== movieId);
  return this.save();
};

// Note: Friend management is handled through the Friendship model
// See models/Friendship.ts and API routes in /api/friends

// Export model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);