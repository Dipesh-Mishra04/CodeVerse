# Flask Backend (AI Tutor + Services)

This backend powers AI tutor and utility APIs for the platform.

## Tech stack
- Python + Flask
- Flask-CORS
- python-dotenv

## Run locally
1. Create venv
2. Install dependencies
3. Start server

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Server default URL: `http://localhost:5000`

## API Routes
- `GET /health` -> Health status
- `POST /api/tutor/ask` -> AI tutor placeholder endpoint

## Folder Structure
- `app/` -> Flask application package
- `app/routes/` -> HTTP route blueprints
- `run.py` -> local entrypoint
