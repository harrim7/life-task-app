# LifeTask AI - AI-Powered Task Management

LifeTask AI is a modern task management application that leverages AI to help users break down large tasks into manageable subtasks, prioritize their to-do list, and receive intelligent suggestions for completing tasks effectively.

## Features

- **AI Task Breakdown**: Automatically break complex tasks into smaller, actionable subtasks
- **Smart Prioritization**: Get AI assistance to prioritize your tasks based on importance and urgency
- **Customizable Categories**: Organize tasks by categories (home, work, finance, health, etc.)
- **Reminder System**: Set and receive reminders for upcoming tasks and deadlines
- **Progress Tracking**: Monitor your progress with visual indicators and completion statistics
- **AI Suggestions**: Receive tailored suggestions for completing specific tasks efficiently

## Tech Stack

### Frontend
- React with TypeScript
- Chakra UI for responsive design
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- MongoDB database with Mongoose ODM
- OpenAI API for AI-powered features
- JWT authentication
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/life-task-ai.git
   cd life-task-ai
   ```

2. Install all dependencies
   ```
   npm run install:all
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` in the backend directory
   - Fill in your MongoDB URI, JWT secret, and OpenAI API key

4. Start the development servers
   ```
   # Start both servers with concurrently
   npm run dev
   
   # Or start them separately
   npm run start:backend
   npm run start:frontend
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Deployment to Heroku

1. Create a Heroku account and install the Heroku CLI
   ```
   npm install -g heroku
   heroku login
   ```

2. Create a new Heroku app
   ```
   heroku create lifetask-ai-app
   ```

3. Use the deployment script
   ```
   ./deploy.sh
   ```
   The script will:
   - Prompt for your MongoDB URI, JWT secret, and OpenAI API key
   - Set up the necessary environment variables in Heroku
   - Push your code to Heroku
   - Build and deploy the application

4. Alternatively, set up environment variables manually and deploy
   ```
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set NODE_ENV=production
   heroku config:set NODE_OPTIONS=--openssl-legacy-provider
   
   git push heroku main
   ```

5. Open your deployed app
   ```
   heroku open
   ```

## Usage Example

### Breaking Down a Complex Task

1. Create a new task (e.g., "Build an ADU on my property")
2. Toggle the "Use AI to break down this task" option
3. Click "Generate Subtasks"
4. Review and customize the generated subtasks
5. Save the task and its subtasks

### Getting AI Suggestions

1. Open a task
2. Click the "Get Help" button
3. Review the AI-generated suggestions, which may include:
   - Recommended approaches
   - Estimated time requirements
   - Resources or contacts
   - Common pitfalls to avoid

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers the AI features
- All the open-source libraries that made this project possible
