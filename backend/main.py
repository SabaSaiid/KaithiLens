"""
KaithiLens Backend API Service.
FastAPI Entrypoint for OCR, Transliteration, and Translation of Kaithi Script Manuscripts.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.pipeline import router as pipeline_router

app = FastAPI(
    title="KaithiLens API",
    description="End-to-end OCR, Transliteration & Translation Pipeline for Historical Kaithi Script Manuscripts.",
    version="1.0.0",
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(pipeline_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to KaithiLens API — Restoring Forgotten History through AI",
        "docs": "/docs",
        "version": "1.0.0",
        "health": "/api/health",
        "samples": "/api/samples",
    }


if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8844))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)

