"""FastAPI dependencies — auth + RBAC."""
from fastapi import Depends, Header, HTTPException, status

from auth.jwt_utils import decode_token
from auth.rbac import RBAC


def get_current_user(authorization: str | None = Header(default=None)) -> RBAC:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "MISSING_TOKEN", "message": "Token JWT manquant"}},
        )
    token = authorization.split(" ", 1)[1].strip()
    try:
        claims = decode_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_TOKEN", "message": str(e)}},
        ) from e
    if claims.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "WRONG_TOKEN_TYPE", "message": "Type de jeton invalide"}},
        )
    return RBAC(claims)


def require_roles(*allowed: str):
    """Factory: dependency that checks the user's role is in `allowed`."""

    def _check(rbac: RBAC = Depends(get_current_user)) -> RBAC:
        if rbac.role not in allowed and not rbac.is_president:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": {"code": "FORBIDDEN", "message": "Rôle non autorisé"}},
            )
        return rbac

    return _check


def require_level(max_level: int):
    def _check(rbac: RBAC = Depends(get_current_user)) -> RBAC:
        if rbac.level > max_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": {"code": "FORBIDDEN", "message": "Niveau hiérarchique insuffisant"}},
            )
        return rbac

    return _check
