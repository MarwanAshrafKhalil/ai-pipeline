# Build stage: need devDependencies for tsc
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && cp -r src/data dist/

# Production stage: only runtime deps
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/index.js"]
