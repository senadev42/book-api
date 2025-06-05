# Build stage
FROM node:slim AS builder

WORKDIR /app

RUN ls -la 

COPY package*.json ./

RUN npm ci

COPY . .

# Generate SSH keys during build
RUN npm run generate-keys

RUN npm run build

FROM node:slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/keys ./keys

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]