# Training Plan Manager - Dockerfile
# Version: 2.1.0-dev
#
# Multi-stage build for production optimization
# [L4] Base image pinned by digest for supply chain security

# Stage 1: Build stage
FROM node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 AS builder

WORKDIR /build

# Copy package files
COPY app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Stage 2: Production stage
FROM node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8

# Set working directory
WORKDIR /app

# Install security updates
RUN apk --no-cache upgrade

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder /build/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs app/server.js ./
COPY --chown=nodejs:nodejs app/package.json ./
COPY --chown=nodejs:nodejs app/public ./public

# Copy setup scripts (for `docker compose run setup`)
COPY --chown=nodejs:nodejs scripts/setup.js ./setup/setup.js
COPY --chown=nodejs:nodejs scripts/lib/ ./setup/lib/

# Create data directory for persistent config (writable volume mount point)
RUN mkdir -p /app/data && chown nodejs:nodejs /app/data

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
