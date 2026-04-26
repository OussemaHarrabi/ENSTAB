"""Service Juridique endpoints."""
from fastapi import APIRouter, Depends
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all

router = APIRouter(prefix="/svc/juridique", tags=["svc_juridique"])
SERVICE = {"slug":"svc_juridique","label":"Service Affaires Juridiques","accentColor":"#991B1B"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Contentieux Actifs","value":8,"unit":"","target":5},{"label":"Contrats Gérés","value":52,"unit":"","target":50},{"label":"Conformité","value":78,"unit":"%","target":90},{"label":"Avis Émis","value":28,"unit":"","target":30}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[75,76,77,78,78])],"distributionChart":[{"label":"Contentieux","value":25},{"label":"Contrats","value":40},{"label":"Conformité","value":20},{"label":"Avis","value":15}]}

@router.get("/contentieux")
async def contentieux(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"active":8,"inProgress":5,"closed":15,"favorableRate":82},"cases":[{"ref":"C-2025-01","title":"Contentieux foncier","type":"Foncier","status":"En cours","date":"15 Jan 2025"},{"ref":"C-2025-02","title":"Litige fournisseur","type":"Commercial","status":"En cours","date":"12 Fév 2025"},{"ref":"C-2025-03","title":"Contestation marché","type":"Administratif","status":"Clôturé","date":"20 Mar 2025"},{"ref":"C-2025-04","title":"Différend personnel","type":"Social","status":"En cours","date":"05 Avr 2025"}],"byType":[{"type":"Foncier","count":3},{"type":"Commercial","count":5},{"type":"Administratif","count":4},{"type":"Social","count":2}]}

@router.get("/contrats")
async def contrats(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"active":52,"renewal":3,"expired":2,"totalAmount":"18.5M DT"},"contracts":[{"ref":"CT-2025-01","title":"Maintenance bâtiments","partner":"Société ABC","amount":450000,"deadline":"31 Déc 2025","status":"Actif"},{"ref":"CT-2025-02","title":"Abonnement électricité","partner":"STEG","amount":1200000,"deadline":"30 Juin 2025","status":"Actif","renew":True},{"ref":"CT-2025-03","title":"Licences logicielles","partner":"TechSoft","amount":250000,"deadline":"15 Mai 2025","status":"Renouvellement"},{"ref":"CT-2025-04","title":"Service nettoyage","partner":"CleanPro","amount":380000,"deadline":"31 Mar 2026","status":"Actif"}]}

@router.get("/conformite")
async def conformite(rbac: RBAC = Depends(get_current_user)):
    return {"overall":78,"items":[{"domain":"Protection des données","score":95,"status":"Conforme","manager":"Service IT"},{"domain":"Marchés publics","score":88,"status":"Conforme","manager":"Finances"},{"domain":"Hygiène & Sécurité","score":72,"status":"Partiellement","deadline":"Juin 2025"},{"domain":"RGPD","score":60,"status":"En cours","deadline":"Sep 2025"},{"domain":"Code du travail","score":90,"status":"Conforme","manager":"RH"},{"domain":"Accessibilité","score":45,"status":"Non conforme","deadline":"Juin 2026"}]}

@router.get("/avis")
async def avis(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"issued":28,"inProgress":5,"requested":3,"avgDays":4.2},"opinions":[{"title":"Marché maintenance IT","requester":"IT","date":"22 Avr 2025","status":"Émis"},{"title":"Convention partenariat","requester":"Recherche","date":"20 Avr 2025","status":"Émis"},{"title":"Règlement intérieur","requester":"SG","date":"18 Avr 2025","status":"En cours"},{"title":"Contrat fourniture","requester":"Finances","date":"15 Avr 2025","status":"Émis"}],"byType":[{"type":"Marchés","count":12},{"type":"Contrats","count":18},{"type":"Règlementaire","count":8},{"type":"Partenariat","count":6}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Bilan Contentieux","type":"PDF","date":"24 Avr 2025"},{"name":"Contrats en Cours","type":"XLSX","date":"20 Avr 2025"},{"name":"Conformité Réglementaire","type":"PDF","date":"18 Avr 2025"}]}
