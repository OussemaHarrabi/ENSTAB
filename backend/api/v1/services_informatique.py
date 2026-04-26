"""Service Informatique endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one

router = APIRouter(prefix="/svc/informatique", tags=["svc_informatique"])
SERVICE = {"slug":"svc_informatique","label":"Service Informatique","accentColor":"#2563EB"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Disponibilité","value":99.2,"unit":"%","target":99.5},{"label":"Incidents Ouverts","value":12,"unit":"","target":5},{"label":"Tickets Résolus","value":45,"unit":"","target":40},{"label":"Score Sécurité","value":82,"unit":"%","target":90}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[98.5,98.8,99.0,99.1,99.2])],"distributionChart":[{"label":"Réseau","value":35},{"label":"Logiciel","value":30},{"label":"Matériel","value":20},{"label":"Sécurité","value":15}]}

@router.get("/incidents")
async def incidents(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"open":12,"resolved":45,"avgResolution":"2.4h","sla":94.2},"incidents":[{"id":"INC-045","title":"Panne serveur FST","priority":"Critique","status":"En cours"},{"id":"INC-046","title":"Problème connexion ENSI","priority":"Haute","status":"Résolu"},{"id":"INC-047","title":"Mise à jour ERP","priority":"Moyenne","status":"Planifié"},{"id":"INC-048","title":"Attaque phishing","priority":"Critique","status":"En cours"},{"id":"INC-049","title":"Imprimante HS","priority":"Basse","status":"Résolu"},{"id":"INC-050","title":"Problème accès base","priority":"Haute","status":"En cours"}],"byPriority":[{"level":"Critique","count":3},{"level":"Haute","count":5},{"level":"Moyenne","count":8},{"level":"Basse","count":6}]}

@router.get("/systemes")
async def systemes(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":24,"operational":22,"warning":2,"offline":0},"systems":[{"name":"ERP UCAR","uptime":99.8,"status":"OK","type":"Critique"},{"name":"Base de Données","uptime":99.5,"status":"OK","type":"Critique"},{"name":"Portail Étudiant","uptime":98.2,"status":"OK","type":"Important"},{"name":"Messagerie","uptime":99.9,"status":"OK","type":"Critique"},{"name":"Site Web","uptime":97.5,"status":"Warning","type":"Standard"},{"name":"WiFi","uptime":95.8,"status":"Warning","type":"Important"}]}

@router.get("/securite")
async def securite(rbac: RBAC = Depends(get_current_user)):
    return {"score":82,"vulnerabilities":37,"audits":4,"gdprCompliance":82,"byLevel":[{"level":"Critique","count":2},{"level":"Élevée","count":5},{"level":"Moyenne","count":12},{"level":"Faible","count":18}],"checks":[{"name":"Pare-feu actif","score":100,"status":"OK"},{"name":"Anti-virus à jour","score":95,"status":"OK"},{"name":"MFA activé","score":72,"status":"Warning"},{"name":"Sauvegardes","score":98,"status":"OK"},{"name":"Politique mots de passe","score":85,"status":"OK"},{"name":"Audit trimestriel","score":65,"status":"Warning"}]}

@router.get("/demandes")
async def demandes(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"pending":18,"inProgress":12,"resolved":45,"sla":92},"requests":[{"id":"REQ-101","title":"Création compte email","requester":"RH","priority":"Normale","status":"En cours"},{"id":"REQ-102","title":"Installation logiciel","requester":"FST","priority":"Haute","status":"Résolu"},{"id":"REQ-103","title":"Accès base données","requester":"Recherche","priority":"Urgente","status":"En cours"},{"id":"REQ-104","title":"Nouvel ordinateur","requester":"Enseignement","priority":"Normale","status":"Planifié"},{"id":"REQ-105","title":"Droits admin","requester":"IT","priority":"Haute","status":"Résolu"}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Disponibilité Systèmes","type":"XLSX","date":"24 Avr 2025"},{"name":"Incidents & Résolution","type":"PDF","date":"20 Avr 2025"},{"name":"Rapport Sécurité","type":"PDF","date":"18 Avr 2025"},{"name":"Inventaire Matériel","type":"XLSX","date":"15 Avr 2025"}]}
