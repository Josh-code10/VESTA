from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, data_source, health, investigate, reports, memory_routes, voice

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(data_source.router, prefix=f"{settings.API_V1_STR}/data-source", tags=["Data Source"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Business Health"])
app.include_router(investigate.router, prefix=f"{settings.API_V1_STR}/investigate", tags=["Investigation"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(memory_routes.router, prefix=f"{settings.API_V1_STR}/memory", tags=["Executive Decision Memory"])
app.include_router(voice.router, prefix=f"{settings.API_V1_STR}/voice", tags=["Executive Voice Narration"])

@app.get("/")
async def root_health_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": f"{settings.API_V1_STR}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
