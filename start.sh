#! /usr/bin/env bash

echo "... starting containers"

echo "... starting frontend"
cd frontend/compose || exit
docker-compose --env-file ../.github.env up --detach

echo "++++ Starting Finished ++++"

cd ../..
