# MeetMind AI

MeetMind AI is a full-stack web application that automatically transcribes and summarizes audio meetings. It uses Faster Whisper for on-device/server transcription and Gemini AI to generate executive summaries, key decisions, and action items.

## Tech Stack

**Frontend**
- Next.js (React)
- Tailwind CSS & Framer Motion
- Supabase Auth & Client

**Backend**
- Python / FastAPI
- Faster Whisper (tiny model optimized for low memory)
- Google Generative AI (Gemini)
- Supabase (PostgreSQL with RLS)

## Local Development

### 1. Database Setup (Supabase)
Create a new Supabase project and run the migrations located in `supabase/migrations/` in order.

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate # Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the development server:
```bash
npm run dev
```

## Architecture Notes (Ponytail)
- Single monolithic FastAPI backend for simplicity.
- Action items and decisions are handled via explicit relational queries rather than complex RPCs.
- `Segments` are intentionally excluded from the history endpoint response to save database space and optimize fetch times; the viewer gracefully falls back to plain text.
- Model sizes are strictly limited (Whisper Tiny, 25MB max upload) to run reliably on limited platforms like Railway without Out of Memory (OOM) errors.
