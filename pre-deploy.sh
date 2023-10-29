#!/bin/bash

# Check if the .env file for the provided APP_NAME exists
if [ -z "$1" ]; then
    ENV_FILE=".env"
else
    ENV_FILE=".env.$1"
fi

if [ ! -f $ENV_FILE ]; then
    echo "Error: $ENV_FILE does not exist!"
    exit 1
fi

# Append node_modules/.bin to the existing PATH
export PATH="$PATH:./node_modules/.bin"

# Deploy using the provided APP_NAME or default .env
dotenv -e $ENV_FILE -- pnpm pre-deploy
