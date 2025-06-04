#! /usr/bin/env bash

START_FLAG="--start"
CURRENT_MODE='prod'

echo "... building images"

cd frontend || exit

if [[ "$1" == "--dev" || "$2" == "--dev" ]]; then
  echo "Building in development mode"
  export BUILD_MODE='dev'
else
  echo "Building in production mode"
  export BUILD_MODE='prod'
fi
  export API_BASE_URL='https://bean-counter.app'
  ./build.sh

cd ..

echo "++++ Building Finished ++++"

# Start Container if started with --start
if [[ "$1" == "$START_FLAG" || "$2" == "$START_FLAG" ]]; then

  if [  "$1" == "--dev" || "$2" == "--dev" ]; then
          docker run bean-v2 -p 3000:3000
  fi

  echo "Starting container"
  ./start.sh
fi
