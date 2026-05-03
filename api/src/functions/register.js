const { TableClient } = require('@azure/data-tables')
const { app } = require('@azure/functions')
const { randomUUID } = require('crypto')

const tableName = process.env.REGISTRATIONS_TABLE_NAME || 'Registrations'
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function responseHeaders(origin = '') {
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': allowOrigin || '*',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  }
}

function normalizeRequiredString(value, fieldName, maxLength) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} is required.`)
  }

  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`${fieldName} is required.`)
  }

  return normalized.slice(0, maxLength)
}

app.http('register', {
  authLevel: 'anonymous',
  methods: ['POST', 'OPTIONS'],
  route: 'register',
  handler: async (request, context) => {
    const origin = request.headers.get('origin') || ''
    const headers = responseHeaders(origin)

    if (request.method === 'OPTIONS') {
      return { headers, status: 204 }
    }

    if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      context.warn(`Rejected registration from disallowed origin: ${origin}`)
      return {
        body: JSON.stringify({ error: 'Origin is not allowed.' }),
        headers,
        status: 403,
      }
    }

    let body

    try {
      body = await request.json()
    } catch {
      return {
        body: JSON.stringify({ error: 'Request body must be valid JSON.' }),
        headers,
        status: 400,
      }
    }

    if (typeof body.website === 'string' && body.website.trim()) {
      context.warn('Ignored registration with populated honeypot field.')
      return {
        body: JSON.stringify({ ok: true }),
        headers,
        status: 200,
      }
    }

    let name
    let email

    try {
      name = normalizeRequiredString(body.name, 'Name', 120)
      email = normalizeRequiredString(body.email, 'Email', 254).toLowerCase()
    } catch (error) {
      return {
        body: JSON.stringify({ error: error.message }),
        headers,
        status: 400,
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        body: JSON.stringify({ error: 'Email must be valid.' }),
        headers,
        status: 400,
      }
    }

    const connectionString = process.env.TABLES_CONNECTION_STRING

    if (!connectionString) {
      context.error('TABLES_CONNECTION_STRING is not configured.')
      return {
        body: JSON.stringify({ error: 'Registration service is not configured.' }),
        headers,
        status: 500,
      }
    }

    const tableClient = TableClient.fromConnectionString(connectionString, tableName)
    const createdAt = new Date().toISOString()

    await tableClient.createEntity({
      partitionKey: 'registrations',
      rowKey: randomUUID(),
      createdAt,
      email,
      name,
      origin,
      referrer: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
    })

    context.info(`Stored registration for ${email}`)

    return {
      body: JSON.stringify({ createdAt, ok: true }),
      headers,
      status: 201,
    }
  },
})
