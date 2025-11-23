import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieRating extends Document {
  user: mongoose.Types.ObjectId;
  movieId: number; // TMDB movie ID
  rating?: number; // 1-10 scale, optional (user might just watch without rating)
  watched: boolean;
  watchedAt?: Date;
  inWatchlist: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieRatingSchema = new Schema<IMovieRating>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  movieId: {
    type: Number,
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: null,
  },
  watched: {
    type: Boolean,
    default: false,
  },
  watchedAt: {
    type: Date,
    default: null,
  },
  inWatchlist: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one rating per user per movie
MovieRatingSchema.index({ user: 1, movieId: 1 }, { unique: true });

// Index for recommendation queries
MovieRatingSchema.index({ movieId: 1, rating: 1 });
MovieRatingSchema.index({ user: 1, watched: 1 });
MovieRatingSchema.index({ user: 1, isFavorite: 1 });

// Pre-save middleware to set watchedAt timestamp
MovieRatingSchema.pre('save', function(next) {
  if (this.isModified('watched') && this.watched && !this.watchedAt) {
    this.watchedAt = new Date();
  }
  next();
});

// Static method to get user's highly rated movies
MovieRatingSchema.statics.getHighlyRatedMovies = async function(
  userId: string,
  minRating: number = 7
) {
  return this.find({
    user: userId,
    rating: { $gte: minRating },
  }).sort({ rating: -1 });
};

export interface SimilarUser {
  _id: mongoose.Types.ObjectId;
  commonMovies: number;
  avgRating: number;
}

// Static method to find users who liked similar movies
MovieRatingSchema.statics.findSimilarUsers = async function(
  userId: string,
  limit: number = 10
) {
  // Get user's highly rated movies
  const userRatings = await this.find({
    user: userId,
    rating: { $gte: 7 },
  }).select('movieId rating');

  if (userRatings.length === 0) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movieIds = userRatings.map((r: any) => r.movieId);

  // Find other users who rated the same movies highly
  const similarUsers = await this.aggregate([
    {
      $match: {
        movieId: { $in: movieIds },
        rating: { $gte: 7 },
        user: { $ne: new mongoose.Types.ObjectId(userId) },
      },
    },
    {
      $group: {
        _id: '$user',
        commonMovies: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    {
      $sort: { commonMovies: -1, avgRating: -1 },
    },
    {
      $limit: limit,
    },
  ]);

  return similarUsers;
};

// Add static methods to TypeScript type
interface MovieRatingModel extends mongoose.Model<IMovieRating> {
  getHighlyRatedMovies(userId: string, minRating?: number): Promise<IMovieRating[]>;
  findSimilarUsers(userId: string, limit?: number): Promise<SimilarUser[]>;
}

export default (mongoose.models.MovieRating as MovieRatingModel) || 
  mongoose.model<IMovieRating, MovieRatingModel>('MovieRating', MovieRatingSchema);
