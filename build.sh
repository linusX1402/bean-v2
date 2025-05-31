#! /usr/bin/env bash

START_FLAG="--start"

echo "... building images"

cd frontend || exit

./build.sh
cd ..

echo "++++ Building Finished ++++"

# Start Container if started with --start
if [[ "$1" == "$START_FLAG" ]]; then
  echo "Starting container"
  ./start.sh
fi
