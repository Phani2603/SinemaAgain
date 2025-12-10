/**
 * Migration Script: Sync Friend Counts
 * 
 * This script updates socialStats.friendsCount for all users based on
 * accepted friendships in the friendships collection.
 * 
 * Run with: npx ts-node scripts/sync-friend-counts.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function syncFriendCounts() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const friendshipsCollection = db.collection('friendships');
    const usersCollection = db.collection('users');

    console.log('\n📊 Analyzing friendships...');

    // Get all accepted friendships
    const acceptedFriendships = await friendshipsCollection
      .find({ status: 'accepted' })
      .toArray();

    console.log(`Found ${acceptedFriendships.length} accepted friendships`);

    // Count friends for each user
    const friendCounts = new Map<string, number>();

    for (const friendship of acceptedFriendships) {
      const requesterId = friendship.requester.toString();
      const recipientId = friendship.recipient.toString();

      // Increment count for both users
      friendCounts.set(requesterId, (friendCounts.get(requesterId) || 0) + 1);
      friendCounts.set(recipientId, (friendCounts.get(recipientId) || 0) + 1);
    }

    console.log(`\n📝 Updating friend counts for ${friendCounts.size} users...`);

    let updatedCount = 0;
    let errorCount = 0;

    // Update each user's friend count
    for (const [userId, count] of friendCounts.entries()) {
      try {
        const result = await usersCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(userId) },
          { $set: { 'socialStats.friendsCount': count } }
        );

        if (result.modifiedCount > 0) {
          updatedCount++;
          console.log(`  ✓ Updated user ${userId}: ${count} friends`);
        }
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Failed to update user ${userId}:`, error);
      }
    }

    // Reset count to 0 for users with no friendships
    const allUsers = await usersCollection.find({}).toArray();
    const usersWithoutFriends = allUsers.filter(
      (user) => !friendCounts.has(user._id.toString())
    );

    console.log(`\n🔄 Resetting count for ${usersWithoutFriends.length} users with no friends...`);

    for (const user of usersWithoutFriends) {
      try {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { 'socialStats.friendsCount': 0 } }
        );
        console.log(`  ✓ Reset user ${user._id}: 0 friends`);
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Failed to reset user ${user._id}:`, error);
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`  ✅ Successfully updated: ${updatedCount} users`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📊 Total friendships processed: ${acceptedFriendships.length}`);

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
syncFriendCounts();
