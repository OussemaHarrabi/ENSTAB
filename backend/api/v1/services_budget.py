"""Service Budget endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one

router = APIRouter(prefix="/svc/budget", tags=["svc_budget"])
SERVICE = {"slug": "svc_budget", "label": "Service Budget", "accentColor": "#0891B2"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {
        "service": SERVICE, "kpIs": [
            {"label": "Budget Total", "value": "85M DT", "unit": "", "target": "90M DT"},
            {"label": "Taux Exécution", "value": 88.2, "unit": "%", "target": 95},
            {"label": "Précision Prévisions", "value": 86.5, "unit": "%", "target": 92},
            {"label": "Écart vs Budget", "value": 4.8, "unit": "%", "target": 5},
        ], "trendChart": [{"month": m, "value": v} for m, v in zip(["Jan","Fév","Mar","Avr","Mai"],[82,84,86,88,88])],
        "distributionChart": [{"category": "Fonctionnement", "value": 55}, {"category": "Investissement","value": 25}, {"category":"Recherche","value":12},{"category":"Autres","value":8}],
    }

@router.get("/allocations")
async def allocations(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT name, total_budget FROM institutions WHERE is_active = true ORDER BY total_budget DESC")
    return {
        "stats": {"total": "85M DT","allocated":"78.5M DT","reserved":"6.5M DT"},
        "byService": [{"name":"Enseignement","budget":28.5,"color":"#7C3AED"},{"name":"Recherche","budget":22.0,"color":"#0D9488"},{"name":"Administration","budget":15.5,"color":"#2563EB"},{"name":"Infrastructure","budget":12.0,"color":"#D97706"},{"name":"Vie Étudiante","budget":4.5,"color":"#F59E0B"}],
        "byInstitution": [{"name":r["name"],"budget":float(r["total_budget"] or 0)/1e6} for r in rows[:6]],
    }

@router.get("/execution")
async def execution(rbac: RBAC = Depends(get_current_user)):
    return {
        "stats": {"allocated":"42.0M DT","consumed":"37.5M DT","rate":85.2,"overspend":3},
        "monthlyCumulative": [{"month":m,"alloue":a,"consomme":c} for m,a,c in zip(["Jan","Fév","Mar","Avr","Mai"],[7,14,21,28,35],[5.8,11.2,17.5,23.8,30.2])],
        "byService": [{"name":s,"alloue":a,"consomme":c,"taux":round(c/a*100,1)} for s,a,c in [("Enseignement",28.5,24.2),("Recherche",22,18.5),("Administration",15.5,13.8),("Infrastructure",12,9.2)]],
    }

@router.get("/previsions")
async def previsions(rbac: RBAC = Depends(get_current_user)):
    return {
        "historical": [{"year":y,"reel":r,"prevu":p} for y,r,p in [(2021,72,70),(2022,75,73),(2023,78.5,76),(2024,82,80),(2025,85,83)]],
        "scenarios": [{"name":"Scénario Réaliste","budget":88.0,"probability":55,"description":"Croissance stable +8%"},{"name":"Scénario Optimiste","budget":95.0,"probability":25,"description":"Augmentation subventions +15%"},{"name":"Scénario Pessimiste","budget":80.0,"probability":20,"description":"Réduction budget -5%"}],
    }

@router.get("/comparaisons")
async def comparaisons(sortBy: str = "budget", rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT code, total_budget FROM institutions WHERE is_active = true ORDER BY total_budget DESC")
    return {"data": [{"name":r["code"],"budget":float(r["total_budget"] or 0)/1e6,"execution":round(75+((i*3)%20),1),"prevision":float(r["total_budget"] or 0)/1e6*1.05} for i,r in enumerate(rows[:8])]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data": [{"name":"Exécution Budgétaire Mensuelle","type":"XLSX","date":"24 Avr 2025"},{"name":"Prévisions Budgétaires","type":"PDF","date":"20 Avr 2025"},{"name":"Allocations par Institution","type":"XLSX","date":"18 Avr 2025"},{"name":"Analyse des Écarts","type":"PDF","date":"15 Avr 2025"}]}
