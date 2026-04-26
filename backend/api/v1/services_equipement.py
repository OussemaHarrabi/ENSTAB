"""Service Équipement & Bâtiments endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all

router = APIRouter(prefix="/svc/equipement", tags=["svc_equipement"])
SERVICE = {"slug":"svc_equipement","label":"Service Équipement & Bâtiments","accentColor":"#D97706"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Bâtiments","value":12,"unit":"","target":15},{"label":"Taux Maintenance","value":87,"unit":"%","target":92},{"label":"Équipements","value":3377,"unit":"","target":3500},{"label":"Projets en Cours","value":3,"unit":"","target":5}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[82,84,85,86,87])],"distributionChart":[{"label":"Bâtiments","value":40},{"label":"Équipements","value":35},{"label":"Maintenance","value":15},{"label":"Projets","value":10}]}

@router.get("/batiments")
async def batiments(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":12,"good":8,"renovate":4,"totalArea":"20 800 m²"},"buildings":[{"name":"Bâtiment A - Administration","surface":3200,"floors":4,"etat":"Bon","occupancy":85,"year":2005},{"name":"Bâtiment B - Enseignement","surface":4500,"floors":5,"etat":"Moyen","occupancy":92,"year":1998},{"name":"Bâtiment C - Laboratoires","surface":2800,"floors":3,"etat":"Bon","occupancy":78,"year":2010},{"name":"Bibliothèque Centrale","surface":3500,"floors":4,"etat":"Excellent","occupancy":65,"year":2015},{"name":"Amphithéâtres","surface":1800,"floors":2,"etat":"Bon","occupancy":75,"year":2008},{"name":"Résidence Universitaire","surface":5000,"floors":6,"etat":"Moyen","occupancy":95,"year":1995}]}

@router.get("/maintenance")
async def maintenance(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":20,"open":8,"resolved":35,"rate":87},"requests":[{"id":"MAINT-01","title":"Fuite d'eau bâtiment B","priority":"Urgente","status":"En cours","assigned":"Hamdi Moulhi"},{"id":"MAINT-02","title":"Climatisation amphi","priority":"Haute","status":"Planifié","assigned":"Maher Riahi"},{"id":"MAINT-03","title":"Réparation électricité","priority":"Urgente","status":"Résolu","assigned":"Akram Azzabi"},{"id":"MAINT-04","title":"Porte bloquée entrée","priority":"Basse","status":"En cours","assigned":"Hamdi Moulhi"}],"byPriority":[{"level":"Urgente","count":3},{"level":"Haute","count":5},{"level":"Moyenne","count":8},{"level":"Basse","count":4}]}

@router.get("/equipements")
async def equipements(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":3377,"operational":2850,"warning":420,"offline":107},"equipments":[{"name":"Ordinateurs","count":850,"status":"OK","depreciation":65},{"name":"Imprimantes","count":120,"status":"Warning","depreciation":78},{"name":"Serveurs","count":45,"status":"OK","depreciation":45},{"name":"Vidéoprojecteurs","count":95,"status":"OK","depreciation":55},{"name":"Mobilier","count":1850,"status":"Warning","depreciation":72},{"name":"Climatisation","count":85,"status":"OK","depreciation":60},{"name":"Équipements Labo","count":320,"status":"Critical","depreciation":88}]}

@router.get("/projets")
async def projets(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"active":3,"completed":1,"planned":1,"budget":"5.55M DT"},"projects":[{"name":"Rénovation Bâtiment A","budget":1200000,"progress":65,"deadline":"Déc 2025"},{"name":"Construction Nouvel Amphi","budget":2500000,"progress":25,"deadline":"Juin 2026"},{"name":"Mise aux Normes Sécurité","budget":450000,"progress":80,"deadline":"Sep 2025"},{"name":"Rénovation Bibliothèque","budget":800000,"progress":100,"deadline":"Avr 2025"},{"name":"Installation Panneaux Solaires","budget":600000,"progress":15,"deadline":"Mar 2026"}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"État des Bâtiments","type":"PDF","date":"24 Avr 2025"},{"name":"Maintenance Réalisée","type":"XLSX","date":"20 Avr 2025"},{"name":"Inventaire Équipements","type":"XLSX","date":"18 Avr 2025"},{"name":"Projets Infrastructures","type":"PDF","date":"15 Avr 2025"}]}
