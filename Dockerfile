# Base image for build
FROM oven/bun:1 as build

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies
COPY package.json bun.lockb ./
RUN apt-get update -qq \
    && apt-get install -y build-essential pkg-config python-is-python3 \
    && bun install --ci

# Build the application
COPY index.ts tsconfig.json ./
COPY src/ src/
RUN bun build --target=bun ./index.ts --outfile="./server.js"

# Production Image
FROM oven/bun:1-alpine 

WORKDIR /app
EXPOSE 4001

# Copy compiled server file from build stage
COPY --from=build /app/server.js .

# Create a non-root user and grant permissions
RUN addgroup user \
    && adduser -G user -s /bin/sh -D user \
    && chown -R user:user /app

# Use the non-root user to run the application
USER user
CMD [ "bun", "./server.js" ]
