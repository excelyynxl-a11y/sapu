import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import init_db
from routers import auth, entries


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup: connect to MongoDB and initialise Beanie."""
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

app.include_router(auth.router)
app.include_router(entries.router)


@app.get("/")
async def root():
    return {"message": "Hello from Sapu"}
