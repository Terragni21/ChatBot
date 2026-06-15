# Terragni Consulting AI Chatbot

A full-stack chatbot for Terragni Consulting with a Python/Flask backend
and a pure HTML/CSS/JS frontend powered by Claude AI.

---

## Project Structure

```
terragni-chatbot/
│
├── backend/
│   ├── app.py               ← Flask API server (Python)
│   └── requirements.txt     ← Python dependencies
│
├── frontend/
│   ├── index.html           ← Main chat UI
│   ├── css/
│   │   └── style.css        ← All styles
│   └── js/
│       └── chat.js          ← Chat logic & API calls
│
└── README.md
```

---

## Setup Instructions

### Step 1 — Get your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click "API Keys" → Create a new key
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Set up the Backend

Open a terminal in the `backend/` folder:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Open `app.py` and replace the placeholder with your real API key:

```python
ANTHROPIC_API_KEY = "sk-ant-YOUR-REAL-KEY-HERE"
```

Start the server:

```bash
python app.py
```

You should see:
```
✅  Terragni Chatbot Backend running → http://localhost:5000
```

---

### Step 3 — Open the Frontend

Open a **new terminal** in the `frontend/` folder.

**Option A — VS Code Live Server (Recommended):**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. It opens at http://127.0.0.1:5500

**Option B — Python simple server:**
```bash
cd frontend
python -m http.server 8080
```
Then open http://localhost:8080

**Option C — Just open the file:**
Double-click `index.html` — this may work but some browsers block localhost API calls from file:// origins.
Use Live Server for best results.

---

## How It Works

```
User types question
      ↓
frontend/js/chat.js  →  POST http://localhost:5000/chat
      ↓
backend/app.py  →  Adds full knowledge base as system prompt
      ↓
Claude API (claude-sonnet-4)  →  Generates answer
      ↓
backend returns reply  →  frontend renders it
```

The knowledge base (all EAS 2023 + 2026 report data + website info)
is embedded in `app.py` as a string and sent to Claude on every request.

---

## API Endpoints

| Method | URL      | Description              |
|--------|----------|--------------------------|
| POST   | /chat    | Send messages, get reply |
| GET    | /health  | Check if server is alive |

POST /chat body:
```json
{
  "messages": [
    { "role": "user", "content": "What is EAS?" }
  ]
}
```

---

## Customization

- To update the knowledge base: edit the `KNOWLEDGE_BASE` string in `app.py`
- To change the AI personality: edit `SYSTEM_PROMPT` in `app.py`
- To change colors/fonts: edit `frontend/css/style.css`
- To add more suggestion chips: edit `frontend/index.html`
- To change the port: change `port=5000` in `app.py` and `API_URL` in `chat.js`

---

## Troubleshooting

**"Failed to fetch" error in browser:**
- Make sure `python app.py` is running
- Check the terminal for any Python errors
- Make sure you're using Live Server, not opening file:// directly

**"Invalid API key" error:**
- Double-check your key in `app.py`
- Make sure there are no extra spaces

**CORS error:**
- flask-cors is already installed and configured
- If still happening, check your browser console for the exact error

---

## Contact Terragni

- Website: www.terragni.in
- Email: engage@terragni.co
- Phone: +91 895 698 2522
- Address: 302-303, Supreme Centre, Anand Park, ITI Road, Aundh, Pune 411007
