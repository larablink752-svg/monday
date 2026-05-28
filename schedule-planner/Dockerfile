FROM node:20-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install --production

# Copy app source
COPY server.js ./
COPY public ./public

# Create data directory for SQLite DB (mounted as volume)
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server.js"]
