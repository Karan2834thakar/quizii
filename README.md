# Quizii - AI-Powered Quiz Arena 🎮

Quizii is a real-time, interactive quiz platform that combines the excitement of live multiplayer competition with the power of Generative AI. Host engaging quizzes, compete with friends, and let AI generate unique questions on the fly.

## 🚀 Key Features

### 🧠 AI-Driven Content
- **Instant Generation**: Create unique quizzes on any topic using Google Gemini AI.
- **Smart Distractors**: AI generates plausible but incorrect options to keep players on their toes.

### ⚡ Real-Time Multiplayer
- **Live Socket Architecture**: Built on Socket.IO for sub-millisecond latency.
- **Smart Auto-Advance**: The game engine automatically transitions when all players answer—no waiting around!
- **Reveal Phase**: A suspenseful "Showdown" moment where everyone's results are revealed simultaneously.

### 🛡️ Robust Architecture
- **Ghost Player Protection**: Handles disconnects gracefully; game flow isn't blocked by dropped players.
- **Secure Auth**: JWT-based authentication with role-based access (Player vs. Host/Admin).
- **Responsive Design**: A premium, "Mobile-First" UI that looks great on any device.

## 🛠️ Tech Stack

**Frontend**
- **React 18** (Vite)
- **TailwindCSS** (v4) & **Framer Motion** for animations
- **Socket.IO Client** for real-time events
- **Lucide React** for iconography

**Backend**
- **Node.js** & **Express**
- **MongoDB** (Mongoose) for data persistence
- **Socket.IO** for event orchestration
- **Google Generative AI (Gemini)** SDK

## ⚙️ Setup & Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/quizii.git
    cd quizii
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # PORT=5000
    # MONGO_URI=mongodb://localhost:27017/quizii
    # JWT_SECRET=your_jwt_secret
    # GEMINI_API_KEY=your_gemini_key
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    - Open `http://localhost:5173` (or the port shown in terminal).

## 📖 How to Play

1.  **Host**: Create a room, select a topic (or let AI generate one), and share the Room Code.
2.  **Players**: Enter the Room Code and your name to join the lobby.
3.  **The Game**:
    - Answer questions before the timer runs out.
    - Faster correct answers earn more points!
    - Watch for the "Reveal" to see how you did.
4.  **Victory**: Check the global leaderboard at the end to see the champion!

---
*Built with ❤️ by the Quizii Team*
