# 🧠 AI Virtual Voice Assistant

An intelligent voice-controlled assistant web application that understands your speech, responds with human-like conversational answers, and performs tasks like searching Google, YouTube, checking the weather, and more — powered by Google Gemini API.

## 🚀 Live Demo

<!-- 👉 [Try the App](https://ai-virtual-assistant-app.onrender.com) -->


## ✨ Features

-  **Voice Recognition** – Uses the Web Speech API to recognize voice input in real time.
-  **AI Response Generator** – Integrates with Google Gemini API to generate smart and context-aware replies.
-  **JWT Authentication** – Secure login and registration using JSON Web Tokens.
-  **User History Tracking** – Stores previous commands and interactions.
-  **Customizable Assistant** – Change the assistant's name and image.
-  **Smart Web Actions** – Automatically opens relevant websites based on voice commands:
  - Google Search
  - YouTube Search/Play
  - Weather Info
  - Calculator
  - Instagram & Facebook


## 🛠️ Tech Stack

| Frontend  | Backend  | APIs | Auth |
|-----------|----------|------|------|
| React.js  | Node.js  | Google Gemini | JWT |
| Tailwind CSS | Express.js | Web Speech API | bcrypt |
| React Router | MongoDB |  | Cookies |


## 🔧 Installation

### Prerequisites

- Node.js
- MongoDB (local or cloud)
- Google Gemini API Key

### Steps

1. Clone the repository:
   git clone https://github.com/Shweta220803/ai-voice-assistant.git
   cd ai-voice-assistant

2. Install dependencies for both `frontend` and `backend`:
   cd frontend
   npm install
   cd ../backend
   npm install

3. Create a `.env` file inside `backend`:
   PORT=
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   CLOUDINARY_NAME=
   CLOUDINARY_API=
   CLOUDINARY_SECRET=

4. Start the backend server:
   npm start
   

5. Start the frontend:
   cd ../frontend
   npm run dev
   
## 📁 Folder Structure

ai-voice-assistant/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── components/
