# Project Title

## Description
This project includes a chatbot and a dashboard. The chatbot provides interactive responses to user queries, while the dashboard allows users to monitor and manage data visually.

## Features
- **Chatbot**: Interactive and user-friendly chatbot for handling queries.
- **Dashboard**: A graphical interface to monitor and manage data.
- **Customizable**: Easily configurable for different use cases.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required variables (e.g., API keys, database credentials).
   - Note:- do look for chat-bot [chatwidget.js] and dashboard env and change supabase and gemini ai credentials

## Usage
## Setting up ENV

1. setup env files in chat-bot and dashboard .

### Running the Chatbot
1. Start the chatbot server:
   ```bash
   npm nodemon server
   ```
   (*server should run on PORT:3000*)
2. Then Open Index.html , you get a demo page to access the bot

### Running the Dashboard
1. Enter dashboard:
   ```bash
   cd dashboard
   ```
2. Install all dependenceries:
   ```bash
   npm i
   ```
3. Start the dashboard server:
   ```bash
   npm run dev
   ```

4. Open the dashboard in your browser (e.g., `http://localhost:4000`).

## Screenshots
### Chatbot
_Add a screenshot of the chatbot interface here._

### Dashboard
_Add a screenshot of the dashboard interface here._

## Contact
For any questions or feedback, please contact [your-email@example.com].