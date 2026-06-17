# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Layer-caching: install dependencies before copying source.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Production build outputs to dist/frontend/browser/
RUN npx ng build --configuration production

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# nginx:alpine is ~8 MB. It serves static files and can proxy API requests.
FROM nginx:alpine AS runtime

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80