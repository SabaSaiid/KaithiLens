#!/usr/bin/env bash
# KaithiLens One-Click Development Startup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================================="
echo "📜 Starting KaithiLens Historical Manuscript Suite 👁️"
echo "=========================================================="

# Check virtual environment
if [ ! -d "backend/venv" ]; then
    echo "Creating backend virtualenv..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# Generate sample images if needed
if [ ! -f "datasets/sample_records/sample_land_deed_1.png" ]; then
    echo "Generating sample historical manuscripts..."
    backend/venv/bin/python3 datasets/generate_sample_images.py
fi

# Kill any existing processes on ports 8000 and 5173 on exit
cleanup() {
    echo ""
    echo "Shutting down KaithiLens servers..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Start Backend API
echo "Starting FastAPI backend on http://127.0.0.1:8000..."
PYTHONPATH=. backend/venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload &

# Start Frontend Dev Server
echo "Starting React frontend on http://localhost:5173..."
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173 &

wait
