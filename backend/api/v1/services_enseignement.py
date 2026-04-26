"""Service Personnel Enseignant endpoints."""
from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one

router = APIRouter(prefix="/svc/enseignement", tags=["svc_enseignement"])

SERVICE = {"slug": "svc_enseignement", "label": "Service Personnel Enseignant", "accentColor": "#7C3AED"}


@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    teachers = fetch_one(
        "SELECT COUNT(*) AS c FROM users u JOIN roles r ON r.id = u.role_id WHERE r.slug = 'teacher' AND u.is_active = true"
    ) or {"c": 0}
    students = fetch_one("SELECT COALESCE(SUM(total_students),0) AS s FROM institutions") or {"s": 0}
    ratio = round(int(students["s"]) / max(1, int(teachers["c"])), 1) if int(teachers["c"]) else 18

    return {
        "service": SERVICE,
        "kpIs": [
            {"label": "Enseignants", "value": int(teachers["c"]), "unit": "", "target": int(teachers["c"]) + 30},
            {"label": "Ratio Étudiant/Ens.", "value": ratio, "unit": "", "target": 20},
            {"label": "Heures Enseignées", "value": 22400, "unit": "h", "target": 23000},
            {"label": "Publications", "value": 900, "unit": "", "target": 1000},
        ],
        "trendChart": [{"date": m, "value": int(teachers["c"]) - i * 3} for i, m in enumerate(["Sep", "Oct", "Nov", "Déc", "Jan"])],
    }


@router.get("/enseignants")
async def enseignants(
    search: str | None = Query(None),
    rank: str | None = Query(None),
    institution: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    where = ["r.slug = 'teacher' AND u.is_active = true"]
    params: list = []
    if search:
        where.append("(u.first_name ILIKE %s OR u.last_name ILIKE %s)")
        params.extend([f"%{search}%", f"%{search}%"])
    if institution:
        where.append("i.code = %s")
        params.append(institution)

    sql = f"""SELECT u.id, u.first_name, u.last_name,
                     COALESCE(s.rank, 'Maître Assistant') AS rank,
                     COALESCE(i.code, 'UCAR') AS institution,
                     COALESCE(s.publications_count, 0) AS publications,
                     COALESCE(s.h_index, 0) AS h_index,
                     u.is_active
              FROM users u JOIN roles r ON u.role_id = r.id
              LEFT JOIN staff s ON s.user_id = u.id
              LEFT JOIN LATERAL (SELECT code FROM institutions WHERE id = ANY(u.institution_ids) LIMIT 1) i ON true
              WHERE {' AND '.join(where)} ORDER BY u.last_name LIMIT %s OFFSET %s"""
    rows = fetch_all(sql, (*params, limit, (page - 1) * limit))
    total = fetch_one(
        f"""SELECT COUNT(*) AS c FROM users u JOIN roles r ON u.role_id = r.id
            LEFT JOIN LATERAL (SELECT code FROM institutions WHERE id = ANY(u.institution_ids) LIMIT 1) i ON true
            WHERE {' AND '.join(where)}""",
        tuple(params),
    ) or {"c": 0}

    return {
        "data": [
            {
                "name": f"{r['first_name']} {r['last_name']}",
                "rank": r["rank"],
                "institution": r["institution"],
                "status": "Actif",
                "publications": int(r["publications"]),
                "hIndex": int(r["h_index"]),
            }
            for r in rows
        ],
        "stats": {"professeurs": 185, "mcf": 320, "ma": 340, "hdr": 145},
        "pagination": {"page": page, "limit": limit, "total": int(total["c"]), "totalPages": (int(total["c"]) + limit - 1) // limit},
    }


@router.get("/promotions")
async def promotions(rbac: RBAC = Depends(get_current_user)):
    return {
        "stats": {"candidates": 12, "complete": 8, "inProgress": 5, "positionsAvailable": 15},
        "pipeline": [
            {"stage": "Dossiers", "count": 12},
            {"stage": "Comité Scientifique", "count": 8},
            {"stage": "Validation", "count": 5},
            {"stage": "Approbation", "count": 3},
        ],
        "candidates": [
            {"name": "Dr. Mohamed Ali", "grade": "MA → MCF", "institution": "ENICarthage", "status": "Dossier", "date": "01 Mai 2025"},
            {"name": "Dr. Sana Mejri", "grade": "MCF → Pr.", "institution": "INSAT", "status": "Comité", "date": "15 Mai 2025"},
            {"name": "Dr. Yassine Zouari", "grade": "MA → MCF", "institution": "ESSAI", "status": "Validation", "date": "30 Mai 2025"},
        ],
    }


@router.get("/charges")
async def charges(rbac: RBAC = Depends(get_current_user)):
    return {
        "stats": {"teachers": 190, "totalHours": 13505, "avgWeekly": "70h", "departments": 6},
        "byDepartment": [
            {"department": "Informatique", "teachers": 45, "hours": 3240, "avgHours": 72, "ratio": 18.5},
            {"department": "Mathématiques", "teachers": 38, "hours": 2660, "avgHours": 70, "ratio": 19.2},
            {"department": "Économie", "teachers": 32, "hours": 2240, "avgHours": 70, "ratio": 21.5},
            {"department": "Langues", "teachers": 28, "hours": 2100, "avgHours": 75, "ratio": 16.8},
            {"department": "Sciences", "teachers": 25, "hours": 1750, "avgHours": 70, "ratio": 18.0},
            {"department": "Droit", "teachers": 22, "hours": 1515, "avgHours": 69, "ratio": 22.0},
        ],
    }


@router.get("/heures")
async def heures(rbac: RBAC = Depends(get_current_user)):
    return {
        "stats": {"completed": 22400, "rate": 95.2, "overtime": 340, "activeTeachers": 190},
        "monthly": [
            {"month": "Sep", "prevues": 2800, "effectuees": 2650},
            {"month": "Oct", "prevues": 3100, "effectuees": 2980},
            {"month": "Nov", "prevues": 3000, "effectuees": 2900},
            {"month": "Déc", "prevues": 2400, "effectuees": 2350},
            {"month": "Jan", "prevues": 2900, "effectuees": 2820},
            {"month": "Fév", "prevues": 3000, "effectuees": 2950},
            {"month": "Mar", "prevues": 3100, "effectuees": 2940},
            {"month": "Avr", "prevues": 2700, "effectuees": 2610},
        ],
    }


@router.get("/recherche")
async def recherche(rbac: RBAC = Depends(get_current_user)):
    pubs = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1") or {"c": 0}
    return {
        "stats": {"publications": int(pubs["c"]), "supervisionRate": 15.2, "avgHIndex": 7.8, "hdrResearchers": 145},
        "byRank": [
            {"rank": "Professeurs", "count": 185, "publications": 285},
            {"rank": "MCF", "count": 320, "publications": 380},
            {"rank": "MA", "count": 340, "publications": 195},
            {"rank": "HDR", "count": 145, "publications": 240},
        ],
        "topResearchers": [
            {"name": "Pr. Mohamed Salah", "publications": 45, "hIndex": 12, "citations": 1280},
            {"name": "Pr. Amira Ben Ali", "publications": 38, "hIndex": 11, "citations": 950},
            {"name": "Dr. Sana Trabelsi", "publications": 32, "hIndex": 9, "citations": 720},
        ],
    }


@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {
        "data": [
            {"name": "Bilan des Heures Enseignées", "type": "PDF", "date": "30 Avr 2025"},
            {"name": "Promotions 2024-2025", "type": "PDF", "date": "20 Avr 2025"},
            {"name": "Production Scientifique", "type": "Excel", "date": "15 Avr 2025"},
        ]
    }
