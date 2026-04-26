"""Service Académique endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one

router = APIRouter(prefix="/svc/academique", tags=["svc_academique"])
SERVICE = {"slug":"svc_academique","label":"Service Affaires Académiques","accentColor":"#4F46E5"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":" inscriptions","value":43200,"unit":"","target":45000},{"label":"Taux Réussite","value":75.8,"unit":"%","target":80},{"label":"Taux Abandon","value":8.2,"unit":"%","target":5},{"label":"Programmes","value":85,"unit":"","target":90}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Sep","Oct","Nov","Déc","Jan"],[40500,41200,41800,42000,42800])],"distributionChart":[{"label":"Licence","value":65},{"label":"Master","value":25},{"label":"Doctorat","value":10}]}

@router.get("/programmes")
async def programmes(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":85,"accredited":12,"renewal":3,"new2025":5},"programs":[{"name":"Licence Informatique","level":"Licence","institution":"ENICarthage","students":450,"status":"Accrédité","accreditation":"2027"},{"name":"Master Data Science","level":"Master","institution":"INSAT","students":120,"status":"Accrédité","accreditation":"2026"},{"name":"Licence Économie","level":"Licence","institution":"FSEGN","students":580,"status":"Accrédité","accreditation":"2028"},{"name":"Master MBA","level":"Master","institution":"IHEC","students":85,"status":"En cours","accreditation":"2025"},{"name":"Doctorat Physique","level":"Doctorat","institution":"FSB","students":65,"status":"Accrédité","accreditation":"2029"},{"name":"Licence Design","level":"Licence","institution":"ESSAI","students":180,"status":"Nouveau","accreditation":"2026"}]}

@router.get("/inscriptions")
async def inscriptions(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total2025":43200,"newStudents":11800,"growth":2.3},"trend":[{"year":y,"inscriptions":i,"nouveaux":n} for y,i,n in [(2020,38500,9500),(2021,39800,10200),(2022,40500,10800),(2023,41800,11200),(2024,42350,11500),(2025,43200,11800)]]}

@router.get("/reussite")
async def reussite(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"rate":75.8,"dropout":8.2,"graduates2024":8500,"honors":32},"byInstitution":[{"institution":n,"taux":t} for n,t in [("ENICarthage",82),("INSAT",85),("EPT",80),("SUPCOM",79),("IHEC",75)]]}

@router.get("/calendrier")
async def calendrier(rbac: RBAC = Depends(get_current_user)):
    return {"events":[{"date":"15-20 Sep 2025","event":"Pré-rentrée","type":"Administratif","status":"Planifié"},{"date":"22 Sep 2025","event":"Début des cours S1","type":"Académique","status":"Planifié"},{"date":"15-30 Nov 2025","event":"Examens partiels","type":"Académique","status":"Planifié"},{"date":"20 Déc 2025","event":"Vacances hiver","type":"Académique","status":"Planifié"},{"date":"12-30 Jan 2026","event":"Examens S1","type":"Académique","status":"Planifié"},{"date":"02 Fév 2026","event":"Début S2","type":"Académique","status":"Planifié"}]}

@router.get("/vie-etudiante")
async def vie_etudiante(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"clubs":18,"members":495,"eventsPerYear":56,"categories":6},"clubs":[{"name":"Club Robotique","members":45,"events":12,"category":"Scientifique"},{"name":"Croissant Rouge","members":120,"events":8,"category":"Social"},{"name":"Club Théâtre","members":35,"events":6,"category":"Culturel"},{"name":"Club Sport","members":200,"events":15,"category":"Sportif"},{"name":"Junior Entreprise","members":30,"events":5,"category":"Entrepreneuriat"},{"name":"Green Club","members":65,"events":10,"category":"Environnement"}]}

@router.get("/comparaisons")
async def comparaisons(metric: str = "taux", rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":n,"taux":t,"aband":a,"emploi":e} for n,t,a,e in [("ENICarthage",82,5,78),("INSAT",85,4,88),("EPT",80,6,85),("SUPCOM",79,6,82)]]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Résultats Semestriels","type":"XLSX","date":"24 Avr 2025"},{"name":"Statistiques Inscriptions","type":"PDF","date":"20 Avr 2025"},{"name":"Taux Réussite","type":"XLSX","date":"18 Avr 2025"},{"name":"Vie Étudiante","type":"PDF","date":"15 Avr 2025"}]}
