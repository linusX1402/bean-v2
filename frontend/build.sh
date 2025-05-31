#! /usr/bin/env bash

DOCKERFILE="./compose/github.Dockerfile"

npm install
npm run build

echo "Building image"
docker build -t bean-v2 -f $DOCKERFILE .