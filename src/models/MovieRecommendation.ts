import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieRecommendation extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  movieId: number;
  message?: string;
  status: 'pending' | 'viewed' | 'watched';
  createdAt: Date;
  viewedAt?: Date;
}

const MovieRecommendationSchema = new Schema<IMovieRecommendation>({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  toUser: {
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
  message: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'watched'],
    default: 'pending',
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  viewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
MovieRecommendationSchema.index({ toUser: 1, status: 1, createdAt: -1 });
MovieRecommendationSchema.index({ fromUser: 1, toUser: 1, movieId: 1 }, { unique: true });
MovieRecommendationSchema.index({ toUser: 1, movieId: 1 });

// Static method to get recommendations received by a user
MovieRecommendationSchema.statics.getReceivedRecommendations = async function(
  userId: string,
  limit: number = 50
) {
  return this.find({ toUser: userId })
    .populate('fromUser', 'name email image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get recommendations sent by a user
MovieRecommendationSchema.statics.getSentRecommendations = async function(
  userId: string,
  limit: number = 50
) {
  return this.find({ fromUser: userId })
    .populate('toUser', 'name email image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to check if recommendation already exists
MovieRecommendationSchema.statics.exists = async function(
  fromUserId: string,
  toUserId: string,
  movieId: number
) {
  return this.findOne({ fromUser: fromUserId, toUser: toUserId, movieId });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MovieRecommendation: any =
  mongoose.models.MovieRecommendation ||
  mongoose.model<IMovieRecommendation>('MovieRecommendation', MovieRecommendationSchema);

export default MovieRecommendation;
