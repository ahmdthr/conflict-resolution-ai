# 🤖 Conflict Resolution with the Help of AI

Welcome to the official project repository for the **"Conflict Resolution with the Help of AI"** hackathon challenge!

This is a web-based chatbot simulation that lets two AI agents (with configurable personality traits) engage in a conflict resolution conversation. After a few turns, a human participant takes over one of the agents and continues the conversation in character.

Whether you're from Computer Science, Physics, or even Humanities — don't worry. This guide assumes minimal prior experience.

---

## 🧠 Project Overview

This React + Node.js application demonstrates how AI can simulate and possibly assist in resolving conflicts.

- Configure **character traits** (e.g., empathy, assertiveness).
- Choose a **scenario** (e.g., workplace disagreement).
- Watch two AI agents talk.
- After 6 messages, take control of one agent and respond like them.
- The base app uses **OpenAI GPT-4o** under the hood.

---

## ⚙️ Setup Instructions

### 🖥️ Prerequisites

You need:

- [Node.js](https://nodejs.org/) (v18 or above)
- A terminal / command prompt
- An internet connection
- OpenAI API Key (You will receive one when the hackathon starts)

---

### 1️⃣ Step 1: Clone the Repository

If you don’t have Git set up already, follow these quick steps:

#### ✅ Install Git (if not installed)

- Go to: https://git-scm.com/downloads
- Download and install Git for your operating system.
- Restart your terminal after installation.

#### ✅ Configure Git (first-time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Clone the repo:

```bash
git clone git@github.com:ahmdthr/conflict-resolution-ai.git
cd conflict-resolution-ai
```

---

### 2️⃣ Step 2: Set Up the Environment

Rename `.env.sample` file in the root of the project to `.env`:

Then paste the following line into it (you’ll get your API key at the hackathon):

```env
OPENAI_API_KEY=your_key_goes_here
```

---

### 3️⃣ Step 3: Install and Run the Server

In one terminal window:

```bash
npm install
node server.js
```

The server will start on [http://localhost:3001](http://localhost:3001)

---

### 4️⃣ Step 4: Start the Frontend (React App)

Open another terminal window:

```bash
npm run dev
```

This will start the frontend on [http://localhost:5173](http://localhost:5173)

---

## 💬 How to Use the App

1. Fill in **conversation setting** and **conversation scenario**.
2. Fill in **names** and **traits** for Agent A and Agent B.
3. Click **Start Chat**.
4. Watch the agents talk (3 turns each).
5. Take over as any agent — reply as if you’re them.
6. Ask another AI agent to mediate.
7. Introduce a new conflicting scenario during the conversation.
8. Try to resolve the challenges.

---

## 🧑‍💻 Technologies Used

- 🧠 OpenAI GPT-4o
- ⚛️ React (with Vite)
- 💅 Material-UI (MUI)
- 🌐 Express.js
- 🔐 dotenv

---

## ❓ Common Errors & Fixes

| Problem                       | Fix                                                             |
| ----------------------------- | --------------------------------------------------------------- |
| `fetch failed` / no response  | Make sure server is running (`node server.js`)                  |
| `OPENAI_API_KEY not set`      | Double check your `.env` file                                   |
| CORS issue in browser console | Restart both server and frontend if URLs changed                |
| Page doesn't load             | Try `npm install` again in both `client/` and `server/` folders |

---

## 🏁 Now You're Ready!

Feel free to explore the code, modify traits, and see how AI handles different personalities and scenarios.

Good luck, and may the best team resolve conflicts with style! ✨
