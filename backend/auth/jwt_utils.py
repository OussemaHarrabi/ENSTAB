"""JWT creation and validation."""
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from config import settings


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(payload: dict[str, Any], minutes: int | None = None) -> str:
    expires = _now_utc() + timedelta(minutes=minutes or settings.JWT_ACCESS_EXPIRE_MINUTES)
    data = {**payload, "exp": expires, "type": "access"}
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    expires = _now_utc() + timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)
    data = {"sub": user_id, "exp": expires, "type": "refresh"}
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_temp_2fa_token(user_id: str) -> str:
    expires = _now_utc() + timedelta(minutes=5)
    data = {"sub": user_id, "exp": expires, "type": "2fa_pending"}
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}") from e
