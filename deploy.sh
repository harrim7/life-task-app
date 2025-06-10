#!/bin/bash

# Deploy to Heroku script
echo "Building and deploying LifeTask AI to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it first."
    exit 1
fi

# Set Heroku config variables
echo "Setting up Heroku environment variables..."
read -p "Enter your MongoDB URI: " mongodb_uri
read -p "Enter your JWT secret (leave blank to generate one): " jwt_secret
read -p "Enter your OpenAI API key: " openai_key

if [ -z "$jwt_secret" ]; then
    echo "Generating a JWT secret..."
    jwt_secret=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    echo "Generated JWT secret: $jwt_secret"
fi

heroku config:set MONGODB_URI="$mongodb_uri"
heroku config:set JWT_SECRET="$jwt_secret"
heroku config:set OPENAI_API_KEY="$openai_key"
heroku config:set NODE_ENV=production
heroku config:set NODE_OPTIONS=--openssl-legacy-provider

# We don't create .env files in the repository anymore
# Refer to backend/SETUP.md for instructions on creating your own .env file locally

# Install dependencies
echo "Installing dependencies..."
npm run install:all

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
echo "Pushing to Heroku..."
git push heroku main

echo "Deployment complete! Your app should be live at your Heroku URL."
echo "You can check the app with: heroku open"