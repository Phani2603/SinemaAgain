import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'friend_request' | 'friend_accepted' | 'movie_recommendation';
  movieId?: number;
  movieTitle?: string;
  message?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['friend_request', 'friend_accepted', 'movie_recommendation'],
    required: true,
    index: true,
  },
  movieId: {
    type: Number,
  },
  movieTitle: {
    type: String,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

// Static method to get notifications for a user
NotificationSchema.statics.getNotifications = async function(
  userId: string,
  limit: number = 50
) {
  return this.find({ recipient: userId })
    .populate('sender', 'name email image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function(userId: string) {
  return this.countDocuments({ recipient: userId, read: false });
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function(userId: string) {
  return this.updateMany(
    { recipient: userId, read: false },
    { read: true }
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Notification: any =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
