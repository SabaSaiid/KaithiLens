#!/usr/bin/env bash
# KaithiLens One-Click Development Startup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BACKEND_PORT=8844
FRONTEND_PORT=5199

echo "=========================================================="
echo "📜 Starting KaithiLens Historical Manuscript Suite 👁️"
echo "=========================================================="

# 1. Setup Backend Virtual Environment
if [ ! -d "backend/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install --upgrade pip
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# 2. Setup Frontend Dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend npm dependencies..."
    cd frontend && npm install && cd ..
fi

# 3. Generate Sample Manuscripts if needed
if [ ! -f "datasets/sample_records/sample_land_deed_1.png" ]; then
    echo "🎨 Generating sample historical manuscripts..."
    backend/venv/bin/python3 datasets/generate_sample_images.py
fi

# Clean exit handler
cleanup() {
    echo ""
    echo "🛑 Shutting down KaithiLens servers..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# 4. Start FastAPI Backend API
echo "🚀 Starting FastAPI backend on http://127.0.0.1:${BACKEND_PORT} (Docs: http://127.0.0.1:${BACKEND_PORT}/docs)..."
PYTHONPATH=. backend/venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port ${BACKEND_PORT} --reload &

# 5. Start React Frontend Dev Server
echo "✨ Starting React frontend on http://127.0.0.1:${FRONTEND_PORT}..."
cd frontend
npm run dev -- --host 127.0.0.1 --port ${FRONTEND_PORT} &

echo ""
echo "🌟 KaithiLens is running!"
echo "   🖥️  Web App:  http://127.0.0.1:${FRONTEND_PORT}"
echo "   📡 API Docs: http://127.0.0.1:${BACKEND_PORT}/docs"
echo "   Press Ctrl+C to stop all servers."
echo ""

wait
