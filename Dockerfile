# syntax=docker/dockerfile:1.7

FROM node:20.18.0-slim AS base
WORKDIR /app

FROM base AS deps
RUN apt-get update -qq \
  && apt-get install -y --no-install-recommends python-is-python3 pkg-config build-essential \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm install --include=dev --workspaces

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20.18.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app .
EXPOSE 8080
CMD ["npm", "run", "start", "--workspace=backend"]

