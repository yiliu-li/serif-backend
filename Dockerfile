# Base image
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json for backend
COPY package*.json ./
COPY prisma ./prisma/

# Install backend dependencies
RUN npm install
# Generate Prisma client
RUN npx prisma generate

# Copy package.json and package-lock.json for frontend
COPY admin-panel/package*.json ./admin-panel/
# Install frontend dependencies
RUN cd admin-panel && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd admin-panel && npm run build

# Build backend
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy backend built assets
COPY --from=builder /app/dist ./dist
# Copy frontend built assets to client folder
COPY --from=builder /app/admin-panel/dist ./client

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
