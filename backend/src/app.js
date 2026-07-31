import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

import env from './config/env.js'
import { swaggerSpec } from './config/swagger.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'

const app = express()

// Security & parsing
app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
if (!env.isProd) app.use(morgan('dev'))

// Basic rate limiting on the API surface
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// API docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'PRISM API Docs' }))
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec))

// Routes
app.get('/', (_req, res) =>
  res.json({ name: 'PRISM API', docs: '/api/docs', health: '/api/health' }),
)
app.use('/api', routes)

// Errors
app.use(notFound)
app.use(errorHandler)

export default app
