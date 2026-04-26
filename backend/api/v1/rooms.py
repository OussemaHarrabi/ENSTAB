"""Rooms & incidents endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC

router = APIRouter(tags=["rooms"])

@router.get("/rooms")
async def list_rooms(institutionId: str = None, type: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"id":"r-001","number":"Salle 204","building":"Bâtiment A","capacity":48,"equipment":["Projecteur","Tableau"],"type":"classroom","status":"Disponible"},{"id":"r-002","number":"Labo 105","building":"Bâtiment B","capacity":24,"equipment":["PCs","Projecteur"],"type":"lab","status":"Disponible"},{"id":"r-003","number":"Amphi A","building":"Bâtiment C","capacity":200,"equipment":["Projecteur","Sonorisation"],"type":"amphitheatre","status":"Disponible"}]}

@router.post("/rooms/reserve")
async def reserve_room(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True,"reservationId":"res-new"}

@router.get("/incidents")
async def list_incidents(institutionId: str = None, status: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"id":"inc-001","type":"equipment","description":"Projecteur défectueux Salle 204","room":"Salle 204","status":"En cours","createdAt":"2025-04-25T10:00:00Z"},{"id":"inc-002","type":"safety","description":"Extincteur manquant","room":"Bâtiment B","status":"Résolu","createdAt":"2025-04-20T14:30:00Z"}]}

@router.post("/incidents")
async def report_incident(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True,"id":"inc-new"}
