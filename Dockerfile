# Training Plan Manager - Dockerfile
# Version: 2.0.0
#
# Multi-stage build for production optimization

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY app/package*.json ./

# Install dependencies (including devDependencies for build if needed)
RUN npm ci --only=production

# Stage 2: Production stage
FROM node:20-alpine

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

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
