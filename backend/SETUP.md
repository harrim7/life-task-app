# Environment Setup

To run the application, you'll need to set up environment variables. Create a `.env` file in the backend directory with the following variables:

## Required Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication (should be a long, random string)
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "development" for local development

## How to Generate a Secure JWT Secret

Run this command to generate a secure random string:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Example .env File Structure

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

**Important:** Never commit your actual `.env` file to version control. It contains sensitive information that should remain private.