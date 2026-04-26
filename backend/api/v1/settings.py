"""User settings endpoints."""
from fastapi import APIRouter, Depends
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_one, execute

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("")
async def get_settings(rbac: RBAC = Depends(get_current_user)):
    return {"language":"fr","notificationsEnabled":True,"theme":"light","emailDigest":"weekly"}

@router.put("")
async def update_settings(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True}
