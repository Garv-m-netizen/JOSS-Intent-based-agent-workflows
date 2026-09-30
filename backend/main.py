from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.workflow import router as workflow_router

app = FastAPI(
    title="Joss Intent Engine API",
    description="FastAPI Backend service for Joss — Intent-Driven Automation Engine",
    version="1.0.0"
)

# Enable CORS for React Frontend (Vite running on http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(workflow_router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "Joss FastAPI Intent Engine",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "engine": "FastAPI"}
