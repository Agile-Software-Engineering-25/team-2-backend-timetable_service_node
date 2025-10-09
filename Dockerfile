# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Ensure log directory exists and is writable by app user
# RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

# Non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001

# Signal handling
RUN apk add --no-cache dumb-init

# Copy deps and app code
COPY --chown=nodejs:nodejs --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# logs-Verzeichnis mit richtigen Rechten erstellen
RUN install -d -o nodejs -g nodejs /app/logs

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_DIR=/apps
ENV DB_HOST=postgres.db
ENV DB_PORT=5432
ENV DB_SCHEMA=ase-2_schema
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
