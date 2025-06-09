#!/bin/bash

# Deploy to Heroku script
echo "Building and deploying LifeTask AI to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it first."
    exit 1
fi

# Build frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# Check if .env file exists in backend
if [ ! -f ./backend/.env ]; then
    echo "Creating sample .env file in backend directory..."
    cat > ./backend/.env << EOF
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
EOF
    echo "WARNING: You need to update the .env file with your actual credentials!"
fi

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
echo "Pushing to Heroku..."
git push heroku main

echo "Deployment complete! Your app should be live at your Heroku URL."
echo "Note: You might need to run the following commands for initial setup:"
echo "  heroku config:set MONGODB_URI=your_mongodb_uri"
echo "  heroku config:set JWT_SECRET=your_jwt_secret"
echo "  heroku config:set OPENAI_API_KEY=your_openai_api_key"