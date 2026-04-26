"""Authentication endpoints — login, logout, refresh, 2FA."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from auth.jwt_utils import (
    create_access_token,
    create_refresh_token,
    create_temp_2fa_token,
    decode_token,
)
from auth.password import verify_password
from auth.two_factor import (
    generate_secret,
    get_qr_png_b64,
    get_qr_uri,
    verify_code,
)
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_one, execute

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Verify2FARequest(BaseModel):
    temp_token: str
    code: str


class RefreshRequest(BaseModel):
    refresh_token: str


class Enable2FARequest(BaseModel):
    code: str | None = None


def _user_payload(row: dict) -> dict:
    return {
        "id": str(row["id"]),
        "email": row["email"],
        "firstName": row["first_name"],
        "lastName": row["last_name"],
        "role": row["role_slug"],
        "roleLabel": row["role_label"],
        "serviceId": row.get("service_id"),
        "serviceName": row.get("service_name"),
        "level": row["role_level"],
        "accentColor": row.get("accent_color"),
        "canAccessInstitutions": ["all"]
        if row.get("can_access_all")
        else [str(i) for i in (row.get("institution_ids") or [])],
        "isActive": row.get("is_active", True),
        "title": row.get("title"),
        "avatar": row.get("avatar_url"),
        "twoFactorEnabled": row.get("two_factor_enabled", False),
    }


def _claims_for_token(row: dict) -> dict:
    return {
        "sub": str(row["id"]),
        "email": row["email"],
        "role": row["role_slug"],
        "role_label": row["role_label"],
        "level": row["role_level"],
        "service_id": row.get("service_id"),
        "service_name": row.get("service_name"),
        "institution_ids": [str(i) for i in (row.get("institution_ids") or [])],
        "can_access_all": row.get("can_access_all", False),
    }


def _load_user_by_email(email: str) -> dict | None:
    sql = """
        SELECT u.*, r.slug AS role_slug, r.label AS role_label, r.level AS role_level,
               r.accent_color AS accent_color
        FROM users u LEFT JOIN roles r ON u.role_id = r.id
        WHERE LOWER(u.email) = LOWER(%s) AND u.is_active = true
        LIMIT 1
    """
    return fetch_one(sql, (email,))


def _load_user_by_id(user_id: str) -> dict | None:
    sql = """
        SELECT u.*, r.slug AS role_slug, r.label AS role_label, r.level AS role_level,
               r.accent_color AS accent_color
        FROM users u LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = %s LIMIT 1
    """
    return fetch_one(sql, (user_id,))


@router.post("/login")
async def login(req: LoginRequest):
    user = _load_user_by_email(req.email)
    if not user:
        raise HTTPException(401, detail={"error": {"code": "INVALID_CREDS", "message": "Identifiants invalides"}})
    if not verify_password(req.password, user["encrypted_password"]):
        raise HTTPException(401, detail={"error": {"code": "INVALID_CREDS", "message": "Identifiants invalides"}})

    if user.get("two_factor_enabled"):
        return {
            "requires_2fa": True,
            "temp_token": create_temp_2fa_token(str(user["id"])),
            "message": "Code 2FA requis",
        }

    claims = _claims_for_token(user)
    return {
        "access_token": create_access_token(claims),
        "refresh_token": create_refresh_token(str(user["id"])),
        "expires_in": 60 * 120,
        "user": _user_payload(user),
    }


@router.post("/verify-2fa")
async def verify_2fa(req: Verify2FARequest):
    try:
        claims = decode_token(req.temp_token)
    except ValueError as e:
        raise HTTPException(401, detail={"error": {"code": "INVALID_TOKEN", "message": str(e)}}) from e
    if claims.get("type") != "2fa_pending":
        raise HTTPException(401, detail={"error": {"code": "WRONG_TOKEN_TYPE", "message": "Jeton 2FA invalide"}})

    user = _load_user_by_id(claims["sub"])
    if not user or not user.get("two_factor_secret"):
        raise HTTPException(404, detail={"error": {"code": "NOT_FOUND", "message": "Utilisateur introuvable"}})

    if not verify_code(user["two_factor_secret"], req.code):
        raise HTTPException(401, detail={"error": {"code": "INVALID_2FA", "message": "Code 2FA incorrect"}})

    full_claims = _claims_for_token(user)
    return {
        "access_token": create_access_token(full_claims),
        "refresh_token": create_refresh_token(str(user["id"])),
        "expires_in": 60 * 120,
        "user": _user_payload(user),
    }


@router.get("/me")
async def get_me(rbac: RBAC = Depends(get_current_user)):
    user = _load_user_by_id(rbac.user_id)
    if not user:
        raise HTTPException(404, detail={"error": {"code": "NOT_FOUND", "message": "Utilisateur introuvable"}})
    return _user_payload(user)


@router.post("/logout")
async def logout(rbac: RBAC = Depends(get_current_user)):
    # Stateless JWT — client discards token. Could add a blocklist with Redis if needed.
    return {"success": True}


@router.post("/refresh")
async def refresh(req: RefreshRequest):
    try:
        claims = decode_token(req.refresh_token)
    except ValueError as e:
        raise HTTPException(401, detail={"error": {"code": "INVALID_TOKEN", "message": str(e)}}) from e
    if claims.get("type") != "refresh":
        raise HTTPException(401, detail={"error": {"code": "WRONG_TOKEN_TYPE", "message": "Refresh token attendu"}})

    user = _load_user_by_id(claims["sub"])
    if not user:
        raise HTTPException(404, detail={"error": {"code": "NOT_FOUND", "message": "Utilisateur introuvable"}})

    return {"access_token": create_access_token(_claims_for_token(user)), "expires_in": 60 * 120}


@router.post("/enable-2fa")
async def enable_2fa(req: Enable2FARequest, rbac: RBAC = Depends(get_current_user)):
    """Two-step: first call returns secret + qr; second call (with code) confirms."""
    if req.code:
        # Verify pre-stored secret and flip the flag
        user = _load_user_by_id(rbac.user_id)
        secret = (user or {}).get("two_factor_secret")
        if not secret or not verify_code(secret, req.code):
            raise HTTPException(400, detail={"error": {"code": "INVALID_CODE", "message": "Code invalide"}})
        execute(
            "UPDATE users SET two_factor_enabled = true, updated_at = now() WHERE id = %s",
            (rbac.user_id,),
        )
        return {"enabled": True}

    # First step — generate and store a fresh secret, return QR
    secret = generate_secret()
    execute(
        "UPDATE users SET two_factor_secret = %s, updated_at = now() WHERE id = %s",
        (secret, rbac.user_id),
    )
    return {
        "secret": secret,
        "uri": get_qr_uri(rbac.email, secret),
        "qr_png_base64": get_qr_png_b64(rbac.email, secret),
    }


@router.post("/disable-2fa")
async def disable_2fa(rbac: RBAC = Depends(get_current_user)):
    execute(
        "UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = %s",
        (rbac.user_id,),
    )
    return {"enabled": False}
