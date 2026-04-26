"""Supabase client singleton + helper for raw SQL via psycopg2."""
from __future__ import annotations

import socket
from functools import lru_cache
from typing import Any

import psycopg2
import psycopg2.extras
from supabase import Client, create_client

from config import settings


@lru_cache
def get_supabase() -> Client:
    """Return a singleton Supabase client (service role)."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


supabase: Client = get_supabase()


def get_pg_connection():
    """Direct psycopg2 connection for raw SQL when supabase-py is not enough."""
    if settings.SUPABASE_DB_URL:
        return psycopg2.connect(settings.SUPABASE_DB_URL, connect_timeout=10)
    raise RuntimeError("SUPABASE_DB_URL not set")


def fetch_all(sql: str, params: tuple | dict | None = None) -> list[dict[str, Any]]:
    """Execute SQL and return list of dict rows."""
    conn = get_pg_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()


def fetch_one(sql: str, params: tuple | dict | None = None) -> dict[str, Any] | None:
    rows = fetch_all(sql, params)
    return rows[0] if rows else None


def execute(sql: str, params: tuple | dict | None = None) -> int:
    conn = get_pg_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            conn.commit()
            return cur.rowcount
    finally:
        conn.close()
