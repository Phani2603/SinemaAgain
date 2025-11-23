import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendship extends Document {
  requester: mongoose.Types.ObjectId; // User who sent the request
  recipient: mongoose.Types.ObjectId; // User who receives the request
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date; // Timestamp when friendship was accepted
}

const FriendshipSchema = new Schema<IFriendship>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for efficient queries
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for efficient queries
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending',
    required: true,
    index: true, // Index for filtering by status
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Compound index to prevent duplicate friendship requests
// Ensures no duplicate requests between same two users (bidirectional)
FriendshipSchema.index(
  { requester: 1, recipient: 1 },
  { unique: true }
);

// Compound index for efficient friend list queries
FriendshipSchema.index({ requester: 1, status: 1 });
FriendshipSchema.index({ recipient: 1, status: 1 });

// Pre-save middleware to set acceptedAt timestamp
FriendshipSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'accepted' && !this.acceptedAt) {
    this.acceptedAt = new Date();
  }
  next();
});

// Static method to check if friendship exists (in any direction)
FriendshipSchema.statics.findFriendship = async function(
  userId1: string,
  userId2: string
) {
  return this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 },
    ],
  });
};

export interface FriendInfo {
  _id: string;
  name: string;
  email: string;
  image?: string;
  friendshipId: mongoose.Types.ObjectId;
  friendsSince?: Date;
}

// Static method to get all friends for a user
FriendshipSchema.statics.getFriends = async function(userId: string) {
  const friendships = await this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' },
    ],
  }).populate('requester recipient', 'name email image');

  // Return friend user objects (not the friendship itself)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return friendships.map((friendship: any) => {
    const friend = friendship.requester._id.toString() === userId 
      ? friendship.recipient 
      : friendship.requester;
    return {
      _id: friend._id,
      name: friend.name,
      email: friend.email,
      image: friend.image,
      friendshipId: friendship._id,
      friendsSince: friendship.acceptedAt,
    };
  });
};

// Static method to get pending requests (received by user)
FriendshipSchema.statics.getPendingRequests = async function(userId: string) {
  return this.find({
    recipient: userId,
    status: 'pending',
  })
    .populate('requester', 'name email image')
    .sort({ createdAt: -1 });
};

// Static method to get sent requests (sent by user)
FriendshipSchema.statics.getSentRequests = async function(userId: string) {
  return this.find({
    requester: userId,
    status: 'pending',
  })
    .populate('recipient', 'name email image')
    .sort({ createdAt: -1 });
};

// Add static methods to TypeScript type
interface FriendshipModel extends mongoose.Model<IFriendship> {
  findFriendship(userId1: string, userId2: string): Promise<IFriendship | null>;
  getFriends(userId: string): Promise<FriendInfo[]>;
  getPendingRequests(userId: string): Promise<IFriendship[]>;
  getSentRequests(userId: string): Promise<IFriendship[]>;
}

export default (mongoose.models.Friendship as FriendshipModel) || 
  mongoose.model<IFriendship, FriendshipModel>('Friendship', FriendshipSchema);
