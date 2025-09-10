
# 🤖 Olama Task – Full Stack Project

A full‑stack application with a **React (Bootstrap)** frontend and a **FastAPI (Python)** backend that integrates **Olama** for AI-powered functionality. The project demonstrates a clean separation between UI and API layers, and shows how to call an AI service from a modern web app.


## 📁 Project structure

```
Olama-Task/
├── olama-task/         # Frontend (React + Bootstrap)
└── Task/               # Backend (Python + FastAPI + Olama)
```

---

## 💡 Features

- Responsive UI built with React and Bootstrap
- FastAPI backend serving REST endpoints
- Olama AI integration for intelligent processing (chat/analysis etc.)
- Real-time search / interaction patterns (where implemented)
- Mobile-friendly layout

---

## 🧰 Tech stack

**Frontend**
- React
- React Bootstrap
- JavaScript (or TypeScript if used)

**Backend**
- Python
- FastAPI
- Olama (AI integration)

---

## 📦 Installation & Local Setup

> These steps assume you have Git, Python (3.9+ recommended), Node (or Bun), and npm/yarn installed.

### 1. Clone the repository

```bash
git clone https://github.com/Nour-2003/Olama-Task.git
cd Olama-Task
```

### 2. Setup the backend

```bash
cd Task
# create and activate a virtual environment (recommended)
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
# run the backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

> The backend will be available at `http://127.0.0.1:8000` by default.

### 3. Setup the frontend

Open a new terminal, then:

```bash
cd ../olama-task
npm install        # or `bun install` / `yarn install` depending on your setup
npm start          # or `npm run dev` if configured
```

> The frontend typically runs on `http://localhost:3000` — check your terminal output.

---

## 🔧 Environment & Configuration

- Add any environment variables the backend or frontend need (for example an Olama API key) and document them in a `.env` or README section. Example:

```
# Task/.env (example)
OLAMA_API_KEY=your_api_key_here
```

---

## 🖼 Screenshots

Add screenshots to `olama-task/assets/` or a `docs/` folder and reference them here. Example:

```markdown
![Homepage](<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cbcb5e1b-3791-4d3b-9f90-81a6efebf9ee" />)
![Loading](<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df30f6d2-fc88-45bb-8d5c-1b6e693a8ab8" />)
![Respone Section](<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dbbc6149-7631-4be5-b148-61d00cbe2431" />)
```

---

## 📬 Contact

- Email: <noureldeanh@gmail.com>
- LinkedIn: https://linkedin.com/in/nour-eldin-hesham-466ab2256
- GitHub: https://github.com/Nour-2003

