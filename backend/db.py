from __future__ import annotations
import os
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "chatbotdb")
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Try to connect with PostgreSQL, fallback to local SQLite database if connection fails
try:
    engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)
    with engine.connect() as conn:
        pass
except Exception:
    os.makedirs("data", exist_ok=True)
    DATABASE_URL = "sqlite:///data/app.db"
    engine = create_engine(DATABASE_URL, future=True, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, future=True, autocommit=False, autoflush=False)


@contextmanager
def db_session():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()