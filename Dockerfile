# Dockerfile for Fragments microservice

# Stage 0: install the base dependencies

# Use node version 18.18.2 for dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS dependencies

# Metadata for the docker
LABEL maintainer="Abdullah Al Mamun Fahim <aamfahim@myseneca.ca>" \
      description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Copy both package.json and package-lock.json to WORKDIR
COPY --chown=node:node package*.json ./

# Install node dependencies(production) defined in package-lock.json
RUN npm ci --only=production

###############################################################################################

# Stage 1: deploy with the dependencies

# Use node version 18.18.2-alpine for depoly
FROM node:18.18.2-alpine@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d AS deploy

# Use /app as our working directory
WORKDIR /app

# Copy cached dependencies(node_modules) from previous stage
COPY --from=dependencies \
      --chown=node:node /app /app

# Copy src from local to docker /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# We default to use port 8080 in our service
# Set node enviornment to production
# Reduce npm spam when installing within Docker
#     https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
# Disable colour when run inside Docker
#     https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV PORT=8080 \
    NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Install curl
RUN apk --no-cache add curl=8.4.0-r0

# Set the user as Node
USER node

# Start the container by running our server using init
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080

# Run a healthcheck on the docker every 30s(--interval)
# Run after 30s (--start-period)
# If it failes wait 30s(--timeout) and try 3 times(--retries)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:${PORT} || exit 1