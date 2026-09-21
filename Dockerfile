# Multi-stage Docker build for Elow E-Commerce Platform

# Stage 1: Dependencies & Production Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root and package definitions for caching
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend & frontend dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy application source code
COPY . .

# Build frontend production bundle
RUN cd frontend && npm run build

# Stage 2: Production Runner Image
FROM node:20-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5005

# Copy production backend service from builder
COPY --from=builder /app/backend ./

# Copy built frontend assets
COPY --from=builder /app/frontend/dist ./public_storefront

# Run process as unprivileged node user
USER node

EXPOSE 5005

CMD ["node", "server.js"]
