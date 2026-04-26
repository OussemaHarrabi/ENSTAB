"""Service Bibliothèque endpoints."""
from fastapi import APIRouter, Depends
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all

router = APIRouter(prefix="/svc/bibliotheque", tags=["svc_bibliotheque"])
SERVICE = {"slug":"svc_bibliotheque","label":"Service Bibliothèque","accentColor":"#B45309"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Collections","value":75512,"unit":"","target":80000},{"label":"Prêts Actifs","value":2300,"unit":"","target":2500},{"label":"Accès Numérique","value":68,"unit":"%","target":75},{"label":"Budget Exécuté","value":87,"unit":"%","target":92}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[62000,65000,68000,72000,75512])],"distributionChart":[{"label":"Livres Papier","value":60},{"label":"e-Books","value":16},{"label":"Revues","value":16},{"label":"Thèses","value":8}]}

@router.get("/collections")
async def collections(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"paper":48500,"digital":20512,"newMonthly":450,"activeUsers":8500},"collectionData":[{"type":"Livres Papier","count":45000},{"type":"Livres Numériques","count":12000},{"type":"Revues Papier","count":3500},{"type":"Revues Numériques","count":8500},{"type":"Thèses & Mémoires","count":6500}]}

@router.get("/prets")
async def prets(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"active":2300,"overdue":85,"todayReturns":42,"returnRate":88},"monthlyData":[{"month":m,"prets":p,"retours":r} for m,p,r in zip(["Jan","Fév","Mar","Avr","Mai"],[520,580,650,720,600],[480,510,590,630,580])]}

@router.get("/numerique")
async def numerique(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"platforms":12,"sessionsPerMonth":52000,"searchesPerMonth":145000,"remoteUsers":3200},"topPlatforms":[{"platform":"ScienceDirect","sessions":4500,"searches":12500},{"platform":"Springer","sessions":3800,"searches":9800},{"platform":"IEEE","sessions":3200,"searches":8500}]}

@router.get("/budget")
async def budget(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"allocated":320000,"spent":280000,"rate":87},"byCategory":[{"category":"Abonnements","allocated":180,"spent":165},{"category":"Acquisitions","allocated":85,"spent":72},{"category":"Maintenance","allocated":35,"spent":28},{"category":"Formation","allocated":20,"spent":15}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Statistiques Annuelles","type":"PDF","date":"24 Avr 2025"},{"name":"Acquisitions mensuelles","type":"XLSX","date":"20 Avr 2025"},{"name":"Budget","type":"XLSX","date":"18 Avr 2025"}]}
