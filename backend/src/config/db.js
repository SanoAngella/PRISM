import mongoose from 'mongoose'
import env from './env.js'
import logger from '../utils/logger.js'

/**
 * Establish a MongoDB connection with sensible defaults and retry logging.
 */
export async function connectDB() {
  mongoose.set('strictQuery', true)
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
    })
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`)
    throw err
  }
}

export async function disconnectDB() {
  await mongoose.disconnect()
}
