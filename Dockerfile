# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 4173 (Vite preview default port)
EXPOSE 4173

ENV REACT_APP_API_BASE_URL=http://localhost:3000/api

# Run the preview command
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
