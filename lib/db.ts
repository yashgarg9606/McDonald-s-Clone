import mongoose from 'mongoose';

const DB_NAME = 'mcdonalds-clone';
let MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Ensure database name is in the connection string
// If URI doesn't have a database name, append it
if (MONGODB_URI) {
  // Extract the path part (everything after the host, before query string)
  const [baseUri, queryString] = MONGODB_URI.split('?');
  const uriPath = baseUri.split('://')[1]?.split('/').slice(1).join('/') || '';
  
  // Check if there's a database name (not empty, doesn't contain @ or : which indicate it's still host info)
  const hasDatabaseName = uriPath && 
    !uriPath.includes('@') && 
    !uriPath.includes(':') && 
    uriPath.length > 0 &&
    !uriPath.match(/^\d+$/); // Not just a port number
  
  if (!hasDatabaseName) {
    // Append database name before query string
    const separator = baseUri.endsWith('/') ? '' : '/';
    MONGODB_URI = `${baseUri}${separator}${DB_NAME}${queryString ? '?' + queryString : ''}`;
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

