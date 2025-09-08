# Multi-stage build für kleineres Image
FROM node:18-alpine AS builder

WORKDIR /app

# Package files kopieren und deps installieren
COPY package*.json ./
RUN npm ci --only=production

# Prod stage
FROM node:18-alpine AS production

WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Signal handling
RUN apk add --no-cache dumb-init

# Deps und Code kopieren
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# SQLite dir erstellen
RUN mkdir -p /app/data && chown nodejs:nodejs /app/data

USER nodejs

# Env defaults (non-sensitive)
ENV NODE_ENV=prod
ENV PROD_PORT=3000
ENV TEST_PORT=4000
ENV LOG_LEVEL=info

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.NODE_ENV !== 'prod' ? process.env.TEST_PORT : process.env.PROD_PORT) + '/api/v1/login', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
