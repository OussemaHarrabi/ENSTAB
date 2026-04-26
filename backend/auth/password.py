"""Password hashing using bcrypt directly (avoids passlib version issues)."""
import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    if not hashed:
        return False
    try:
        # support both bcrypt-style hashes and pgcrypto crypt() hashes (both are bcrypt-compat)
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False
