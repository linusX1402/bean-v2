#! /usr/bin/env bash

echo "... starting containers"

echo "... starting frontend"
cd frontend/compose || exit
docker-compose up --detach

echo "++++ Starting Finished ++++"

cd ../..
