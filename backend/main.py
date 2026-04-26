"""UCAR Intelligence Platform — FastAPI entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.v1.router import api_router
from config import settings

app = FastAPI(
    title="UCAR Intelligence Platform API",
    version="2.0.0",
    description="Backend API for the Université de Carthage intelligence platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "version": "2.0.0", "env": settings.APP_ENV}


@app.get("/")
async def root() -> dict:
    return {
        "name": "UCAR Intelligence Platform API",
        "docs": "/docs",
        "health": "/health",
        "api": settings.API_BASE_URL,
    }


app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(Exception)
async def all_exception_handler(_, exc: Exception):  # type: ignore
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL", "message": str(exc)}},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
