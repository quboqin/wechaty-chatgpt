FROM node:18

# We don't need the standalone Chromium
RUN apt-get update \
    && npm install -g pm2
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ['npm' 'run']