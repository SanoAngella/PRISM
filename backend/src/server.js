import app from './app.js'
import env from './config/env.js'
import { connectDB } from './config/db.js'
import logger from './utils/logger.js'

async function start() {
  try {
    await connectDB()
    const server = app.listen(env.port, () => {
      logger.info(`PRISM API running on http://localhost:${env.port} (${env.nodeEnv})`)
      logger.info(`API docs at http://localhost:${env.port}/api/docs`)
    })

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.warn(`${signal} received — shutting down`)
      server.close(() => process.exit(0))
    }
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`)
})
