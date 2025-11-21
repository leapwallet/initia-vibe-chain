FROM oven/bun:1-alpine

# Update packages and install security updates, then install curl for health checks
RUN apk update && apk upgrade && apk add --no-cache dumb-init curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S bunuser
RUN adduser -S bunuser -u 1001

# Change ownership of the app directory
RUN chown -R bunuser:bunuser /app
USER bunuser

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173 || exit 1

# Start the application with dumb-init for proper signal handling
CMD ["dumb-init", "bun", "run", "dev", "--host", "0.0.0.0"]
