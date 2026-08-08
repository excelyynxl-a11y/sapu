import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import init_db
from routers import auth, entries, forecast


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(entries.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")


frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

# @app.get("/")
# async def root():
#     return {"message": "Hello from Sapu"}

@app.get("/api")
async def root():
    return {"message": "Hello from Sapu"}

@app.get("/{path:path}")
async def serve_spa(path: str):
    if ".." in path:
        return FileResponse(os.path.join(frontend_dist, "index.html"))
    
    file_path = os.path.join(frontend_dist, path)
    if path and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    return FileResponse(os.path.join(frontend_dist, "index.html"))
