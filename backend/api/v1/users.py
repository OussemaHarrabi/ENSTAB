"""Users & role assignment endpoints."""
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one, execute
from auth.password import hash_password

router = APIRouter(prefix="/users", tags=["users"])

class AssignUserRequest(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    role: str
    serviceId: str = ""
    serviceName: str = ""
    canAccessInstitutions: list[str] = []

@router.get("")
async def list_users(search: str = None, role: str = None, service: str = None, page: int = 1, limit: int = 20, rbac: RBAC = Depends(get_current_user)):
    if not rbac.can_manage_users():
        raise HTTPException(403, detail={"error":{"code":"FORBIDDEN","message":"Accès non autorisé"}})
    where = ["1=1"]; params = []
    if search:
        where.append("(LOWER(u.first_name) LIKE %s OR LOWER(u.last_name) LIKE %s OR LOWER(u.email) LIKE %s)")
        params.extend([f"%{search.lower()}%"]*3)
    if role: where.append("r.slug = %s"); params.append(role)
    w = " AND ".join(where)
    rows = fetch_all(f"SELECT u.*, r.slug AS role_slug, r.label AS role_label, r.level AS role_level, r.accent_color FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE {w} ORDER BY u.first_name LIMIT %s OFFSET %s", (*params, limit, (page-1)*limit)) or []
    total = fetch_one(f"SELECT COUNT(*) AS c FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE {w}", tuple(params)) or {"c":0}
    return {"data":[{"id":str(r["id"]),"email":r["email"],"firstName":r["first_name"],"lastName":r["last_name"],"role":r.get("role_slug"),"roleLabel":r.get("role_label"),"level":r.get("role_level"),"isActive":r.get("is_active",True)} for r in rows],"pagination":{"page":page,"limit":limit,"total":int(total["c"]),"totalPages":max(1,(int(total["c"])+limit-1)//limit)}}

@router.post("/assign")
async def assign_user(req: AssignUserRequest, rbac: RBAC = Depends(get_current_user)):
    role = fetch_one("SELECT * FROM roles WHERE slug = %s", (req.role,))
    if not role: raise HTTPException(404, detail={"error":{"code":"NOT_FOUND","message":"Rôle introuvable"}})
    return {"success":True,"user":{"email":req.email,"firstName":req.firstName,"lastName":req.lastName,"role":req.role}}

@router.put("/{user_id}")
async def update_user(user_id: str, data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True}

@router.delete("/{user_id}")
async def deactivate_user(user_id: str, rbac: RBAC = Depends(get_current_user)):
    execute("UPDATE users SET is_active = false WHERE id = %s", (user_id,))
    return {"success":True}
