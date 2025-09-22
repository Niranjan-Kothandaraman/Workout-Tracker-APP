FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# ✅ Ensure DB file/folder is writable inside container
RUN mkdir -p /app && chmod -R 777 /app

EXPOSE 4000
CMD ["npm", "start"]
