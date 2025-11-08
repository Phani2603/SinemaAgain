import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Enhanced environment validation with better error handling
if (!MONGODB_URI) {
  // During build time or test environment, provide appropriate handling
  if (process.env.NODE_ENV === 'test') {
    console.warn('⚠️  MONGODB_URI not found - using test mode');
  } else if (process.env.CI === 'true') {
    console.warn('⚠️  MONGODB_URI not found - CI build mode');
  } else if (typeof window === 'undefined') {
    // Server-side in development/production
    console.error('❌ Please define the MONGODB_URI environment variable inside .env.local');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<typeof mongoose | null> {
  // Handle cases where MongoDB URI is not available
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
      console.log('🧪 Skipping MongoDB connection in test/CI environment');
      return null;
    }
    throw new Error('MONGODB_URI is not defined');
  }

  // Return existing connection if available
  if (cached!.conn) {
    console.log('♻️  Using existing MongoDB connection');
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'sinema-reborn',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
      retryWrites: true, // Retry failed writes
      retryReads: true, // Retry failed reads
    };

    console.log('🔌 Connecting to MongoDB...');
    
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Successfully connected to MongoDB');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return mongoose;
    }).catch((error) => {
      console.error('❌ Failed to connect to MongoDB:', error);
      cached!.promise = null; // Reset promise so we can retry
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  } catch (error) {
    cached!.promise = null; // Reset promise on error
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Export utility function to check connection status
export const getConnectionStatus = () => {
  if (!mongoose.connection) {
    return 'not-initialized';
  }
  
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

// Export function to gracefully close connection
export const closeConnection = async () => {
  try {
    if (cached?.conn) {
      await cached.conn.disconnect();
      cached.conn = null;
      cached.promise = null;
      console.log('✅ MongoDB connection closed gracefully');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export default connectToDatabase;