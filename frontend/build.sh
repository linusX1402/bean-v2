#! /usr/bin/env bash

DOCKERFILE="./compose/github.Dockerfile"

npm install
npm run build

echo "Building image"
#ToDo: change image name
docker build -t nuxt-starter -f $DOCKERFILE .