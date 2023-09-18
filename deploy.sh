#!/bin/bash

# Check if an argument was provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh APP_NAME"
    exit 1
fi

# Check if the .env file for the provided APP_NAME exists
if [ ! -f .env.$1 ]; then
    echo "Error: .env.$1 does not exist!"
    exit 1
fi

# Append node_modules/.bin to the existing PATH
export PATH="$PATH:./node_modules/.bin"

# Deploy using the provided APP_NAME
dotenv -e .env.$1 -- pnpm deploy:all
