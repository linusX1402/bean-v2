#! /usr/bin/env bash

DOCKERFILE="./compose/Dockerfile"

npm install
npm run build

echo "Building image"
docker build \
--build-arg BUILD_MODE=$BUILD_MODE \
--build-arg API_BASE_URL=$API_BASE_URL \
-t bean-v2 -f $DOCKERFILE .