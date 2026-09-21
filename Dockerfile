# Multi-stage Docker build for Elow Node/Express Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Expose port
EXPOSE 5005

ENV NODE_ENV=production

CMD ["npm", "--prefix", "backend", "start"]
