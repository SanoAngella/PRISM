import swaggerJSDoc from 'swagger-jsdoc'
import env from './env.js'

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'PRISM API',
    version: '1.0.0',
    description:
      'AI-powered pharmacy intelligence platform. Patients locate medicines, pharmacies manage stock and sales, and health authorities receive AI-generated outbreak alerts from demand anomalies.',
    contact: { name: 'PRISM Team', email: 'team@prism.rw' },
    license: { name: 'MIT' },
  },
  servers: [{ url: `http://localhost:${env.port}/api`, description: 'Local server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'object' },
        },
      },
    },
  },
  tags: [{ name: 'System', description: 'Service health' }],
}

const options = {
  definition,
  apis: ['./src/routes/*.js'], // JSDoc annotations live in route files
}

export const swaggerSpec = swaggerJSDoc(options)
