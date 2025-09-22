# Stage 1: Build React app
FROM node:18-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
