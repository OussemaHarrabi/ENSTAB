"""Secrétariat Général endpoints."""
from fastapi import APIRouter, Depends
from api.deps import get_current_user
from auth.rbac import RBAC

router = APIRouter(prefix="/svc/sg", tags=["svc_sg"])
SERVICE = {"slug":"svc_sg","label":"Secrétariat Général","accentColor":"#4A5568"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Courriers Traités","value":145,"unit":"","target":150},{"label":"Décisions Publiées","value":45,"unit":"","target":40},{"label":"Réunions tenues","value":18,"unit":"","target":15},{"label":"Documents Archivés","value":245,"unit":"","target":200}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[130,138,140,145,145])],"distributionChart":[{"label":"Courrier","value":35},{"label":"Décisions","value":20},{"label":"Réunions","value":15},{"label":"Documents","value":30}]}

@router.get("/courrier")
async def courrier(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"received":145,"inProgress":12,"processed":128,"urgent":5},"mails":[{"ref":"C-2025-001","objet":"Demande accréditation","expediteur":"ENICarthage","date":"24 Avr 2025","urgence":"Haute","statut":"Traité"},{"ref":"C-2025-002","objet":"Rapport activité","expediteur":"Service RH","date":"23 Avr 2025","urgence":"Normale","statut":"En cours"},{"ref":"C-2025-003","objet":"Convention partenariat","expediteur":"Université Paris","date":"22 Avr 2025","urgence":"Haute","statut":"En cours"},{"ref":"C-2025-004","objet":"Demande budget","expediteur":"Recherche","date":"21 Avr 2025","urgence":"Urgente","statut":"En attente"},{"ref":"C-2025-005","objet":"PV Conseil Université","expediteur":"Présidence","date":"20 Avr 2025","urgence":"Normale","statut":"Traité"},{"ref":"C-2025-006","objet":"Notification ministérielle","expediteur":"MESRS","date":"19 Avr 2025","urgence":"Haute","statut":"Traité"}]}

@router.get("/decisions")
async def decisions(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"published":45,"inProgress":8,"draft":5,"pending":3},"decisions":[{"ref":"D-2025-001","title":"Nomination Chef département","type":"Nominative","date":"22 Avr 2025","status":"Publié"},{"ref":"D-2025-002","title":"Budget complémentaire","type":"Financière","date":"20 Avr 2025","status":"En cours"},{"ref":"D-2025-003","title":"Calendrier 2025-2026","type":"Académique","date":"18 Avr 2025","status":"Publié"},{"ref":"D-2025-004","title":"Règlement intérieur","type":"Réglementaire","date":"15 Avr 2025","status":"Projet"},{"ref":"D-2025-005","title":"Formation continue","type":"Pédagogique","date":"12 Avr 2025","status":"Publié"}]}

@router.get("/reunions")
async def reunions(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"thisMonth":18,"planned":3,"held":15,"participants":70},"meetings":[{"title":"Conseil d'Université","date":"15 Mai 2025","time":"09:00","lieu":"Salle du Conseil","participants":18,"status":"Planifié"},{"title":"Comité de Direction","date":"08 Mai 2025","time":"10:00","lieu":"Bureau du Président","participants":12,"status":"Planifié"},{"title":"Commission Budget","date":"25 Avr 2025","time":"14:00","lieu":"Salle de Réunion","participants":8,"status":"Tenue"},{"title":"Bureau Exécutif","date":"18 Avr 2025","time":"09:30","lieu":"Salle du Conseil","participants":15,"status":"Tenue"},{"title":"Réunion SG-Directeurs","date":"10 Avr 2025","time":"11:00","lieu":"Bureau SG","participants":10,"status":"Tenue"}]}

@router.get("/documents")
async def documents(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":245,"minutes":85,"reports":42,"archives2025":38},"documents":[{"name":"PV Conseil 25-03-2025","type":"PDF","size":"2.4 MB","date":"25 Mar 2025","category":"PV"},{"name":"Rapport Annuel 2024","type":"PDF","size":"8.1 MB","date":"15 Fév 2025","category":"Rapports"},{"name":"Organigramme UCAR","type":"PDF","size":"1.2 MB","date":"10 Jan 2025","category":"Organisation"},{"name":"Budget 2025 signé","type":"PDF","size":"4.5 MB","date":"20 Déc 2024","category":"Budget"},{"name":"Plan stratégique","type":"PDF","size":"12 MB","date":"01 Nov 2024","category":"Stratégie"},{"name":"Règlement intérieur","type":"PDF","size":"0.8 MB","date":"01 Sep 2024","category":"Règlementaire"}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Rapport d'Activité SG","type":"PDF","date":"24 Avr 2025"},{"name":"Suivi des Décisions","type":"XLSX","date":"20 Avr 2025"},{"name":"Registre Courrier","type":"XLSX","date":"18 Avr 2025"}]}
