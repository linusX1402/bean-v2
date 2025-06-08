#! /usr/bin/env bash

echo "... starting container"

# Check if token is provided
#if [ -z "$1" ]; then
#  echo "Error: token is required"
#  exit 1
#fi

# Login to Docker registry
#echo "$1" | docker login ghcr.io -u linusx1402 --password-stdin
#if [ $? -ne 0 ]; then
#  echo "Error: Docker login failed"
#  exit 1
#fi

# Stop and remove existing container if it exists
if docker ps -a --format '{{.Names}}' | grep -q '^bean-v2$'; then
  echo "Stopping and removing existing container..."
  docker stop bean-v2 && docker rm bean-v2
fi

# Run the container
docker run --name bean-v2 -d -p 3000:3000 ghcr.io/linusx1402/bean-v2:latest
if [ $? -ne 0 ]; then
  echo "Error: Failed to start container"
  docker logout
  exit 1
fi

# Logout from Docker registry
docker logout
echo "Container started successfully"