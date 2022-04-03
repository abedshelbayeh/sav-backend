# Builder builds Production code
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy files required to install dependencies
COPY package*.json ./

# Install dependencies and copy source code
RUN npm install --production
COPY ./ ./

# Release includes bare minimum required to run the app, copied from Builder
FROM builder AS release

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Expose container port
EXPOSE 8080

CMD ["npm", "start"]