# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001

# Signal handling
RUN apk add --no-cache dumb-init

# Copy deps and app code
COPY --chown=nodejs:nodejs --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Ensure log directory exists and is writable by app user
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_DIR=/apps
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
