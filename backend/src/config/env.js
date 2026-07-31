import dotenv from 'dotenv'

dotenv.config()

/**
 * Centralised, validated environment configuration.
 * Fail fast in production if critical secrets are missing.
 */
const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prism',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_insecure_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  alerts: {
    warningThreshold: parseInt(process.env.ALERT_WARNING_THRESHOLD || '25', 10),
    criticalThreshold: parseInt(process.env.ALERT_CRITICAL_THRESHOLD || '60', 10),
  },
  isProd: (process.env.NODE_ENV || 'development') === 'production',
}

if (env.isProd && env.jwt.secret === 'dev_insecure_secret_change_me') {
  // eslint-disable-next-line no-console
  console.error('FATAL: JWT_SECRET must be set in production.')
  process.exit(1)
}

export default env
