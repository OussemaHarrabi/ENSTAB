"""Service RH endpoints."""
from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import execute, fetch_all, fetch_one

router = APIRouter(prefix="/svc/rh", tags=["svc_rh"])

SERVICE = {"slug": "svc_rh", "label": "Service RH", "accentColor": "#0D9488"}


@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    total_staff = fetch_one("SELECT COALESCE(SUM(total_staff), 0) AS s FROM institutions") or {"s": 0}
    total = int(total_staff["s"])
    return {
        "service": SERVICE,
        "kpIs": [
            {"label": "Effectif Total", "value": total, "unit": "", "target": total + 50},
            {"label": "Turnover", "value": 4.2, "unit": "%", "target": 5},
            {"label": "Ancienneté Moyenne", "value": 8.5, "unit": "ans", "target": 10},
            {"label": "Absentéisme", "value": 3.1, "unit": "%", "target": 4},
        ],
        "trendChart": [{"date": m, "value": total - i * 5} for i, m in enumerate(["Jan", "Fév", "Mar", "Avr", "Mai"])],
        "distributionChart": [
            {"label": "Administratif", "value": int(total * 0.45)},
            {"label": "Technique", "value": int(total * 0.20)},
            {"label": "Enseignant", "value": int(total * 0.30)},
            {"label": "Support", "value": int(total * 0.05)},
        ],
    }


@router.get("/personnel")
async def personnel(
    search: str | None = Query(None),
    institution: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    where = ["u.is_active = true"]
    params: list = []
    if search:
        where.append("(u.first_name ILIKE %s OR u.last_name ILIKE %s OR u.email ILIKE %s)")
        s = f"%{search}%"
        params.extend([s, s, s])
    if institution:
        where.append("i.code = %s")
        params.append(institution)

    sql = f"""SELECT u.id, u.first_name, u.last_name, u.email, r.label AS role_label,
                     COALESCE(i.code, 'UCAR') AS institution_code, u.is_active
              FROM users u LEFT JOIN roles r ON u.role_id = r.id
              LEFT JOIN LATERAL (SELECT code FROM institutions WHERE id = ANY(u.institution_ids) LIMIT 1) i ON true
              WHERE {' AND '.join(where)} ORDER BY u.last_name LIMIT %s OFFSET %s"""
    rows = fetch_all(sql, (*params, limit, (page - 1) * limit))
    total = fetch_one(
        f"SELECT COUNT(*) AS c FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE {' AND '.join(where)}",
        tuple(params),
    ) or {"c": 0}

    return {
        "data": [
            {
                "id": str(r["id"]),
                "name": f"{r['first_name']} {r['last_name']}",
                "role": r.get("role_label") or "—",
                "institution": r.get("institution_code") or "UCAR",
                "status": "Actif" if r.get("is_active") else "Inactif",
                "email": r["email"],
            }
            for r in rows
        ],
        "stats": {"total": int(total["c"]), "turnover": "4.2%", "seniority": "8.5 ans", "absenteeism": "3.1%"},
        "pagination": {"page": page, "limit": limit, "total": int(total["c"]), "totalPages": (int(total["c"]) + limit - 1) // limit},
    }


@router.get("/recrutement")
async def recrutement(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM recruitment_positions ORDER BY created_at DESC LIMIT 50")
    return {
        "stats": {
            "openPositions": sum(1 for r in rows if r["status"] == "open"),
            "candidates": sum(int(r.get("candidates", 0) or 0) for r in rows),
            "inEvaluation": sum(1 for r in rows if r["status"] == "evaluation"),
            "accepted": sum(1 for r in rows if r["status"] == "accepted"),
        },
        "pipeline": [
            {"stage": "Candidatures", "count": 95},
            {"stage": "Pré-sélection", "count": 62},
            {"stage": "Entretiens", "count": 38},
            {"stage": "Offres", "count": 12},
            {"stage": "Acceptées", "count": 8},
        ],
        "positions": [
            {
                "title": r["title"],
                "dept": r.get("department", "—"),
                "candidates": int(r.get("candidates", 0) or 0),
                "status": "Ouvert" if r["status"] == "open" else r["status"],
                "deadline": r["deadline"].strftime("%d %b %Y") if r.get("deadline") else "—",
            }
            for r in rows
        ],
    }


@router.post("/recrutement")
async def create_position(payload: dict, rbac: RBAC = Depends(get_current_user)):
    execute(
        """INSERT INTO recruitment_positions (title, department, candidates, status, deadline)
           VALUES (%s, %s, %s, COALESCE(%s, 'open'), %s)""",
        (payload.get("title"), payload.get("department"), payload.get("candidates", 0), payload.get("status"), payload.get("deadline")),
    )
    return {"success": True}


@router.get("/conges")
async def conges(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT l.*, u.first_name, u.last_name FROM leaves l
           LEFT JOIN users u ON u.id = l.user_id ORDER BY l.created_at DESC LIMIT 100"""
    )
    pending = [r for r in rows if r["status"] == "pending"]
    return {
        "stats": {
            "thisMonth": len(rows),
            "pending": len(pending),
            "approved": sum(1 for r in rows if r["status"] == "approved"),
            "rejected": sum(1 for r in rows if r["status"] == "rejected"),
        },
        "pending": [
            {
                "id": str(r["id"]),
                "name": f"{r.get('first_name','')} {r.get('last_name','')}".strip() or "Anonyme",
                "type": r.get("leave_type") or "Congé",
                "days": int(r.get("days") or 1),
                "period": f"{r['start_date']} → {r['end_date']}" if r.get("start_date") else "—",
                "status": "En attente",
            }
            for r in pending
        ],
        "monthlyData": [
            {"month": "Jan", "pris": 85, "planifies": 95},
            {"month": "Fév", "pris": 72, "planifies": 90},
            {"month": "Mar", "pris": 95, "planifies": 100},
            {"month": "Avr", "pris": 88, "planifies": 92},
        ],
    }


@router.put("/conges/{leave_id}")
async def update_leave(leave_id: str, payload: dict, rbac: RBAC = Depends(get_current_user)):
    new_status = payload.get("status")
    execute("UPDATE leaves SET status = %s WHERE id = %s", (new_status, leave_id))
    return {"success": True, "status": new_status}


@router.post("/conges")
async def create_leave(payload: dict, rbac: RBAC = Depends(get_current_user)):
    execute(
        """INSERT INTO leaves (user_id, leave_type, days, start_date, end_date, status)
           VALUES (%s, %s, %s, %s, %s, 'pending')""",
        (
            payload.get("userId") or rbac.user_id,
            payload.get("type"),
            payload.get("days", 1),
            payload.get("startDate"),
            payload.get("endDate"),
        ),
    )
    return {"success": True}


@router.get("/formation")
async def formation(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM training_programs ORDER BY created_at DESC LIMIT 50")
    return {
        "stats": {
            "activePrograms": sum(1 for r in rows if r["status"] == "En cours"),
            "participants": sum(int(r.get("participants", 0) or 0) for r in rows),
            "hours": 2450,
            "budget": int(sum(float(r.get("budget", 0) or 0) for r in rows)),
        },
        "programs": [
            {
                "name": r["name"],
                "participants": int(r.get("participants", 0) or 0),
                "budget": float(r.get("budget", 0) or 0),
                "status": r["status"],
                "sessions": int(r.get("sessions", 1) or 1),
            }
            for r in rows
        ],
        "categories": [
            {"name": "Informatique", "count": 25, "color": "#2563EB"},
            {"name": "Management", "count": 18, "color": "#7C3AED"},
            {"name": "Langues", "count": 12, "color": "#16A34A"},
            {"name": "Pédagogie", "count": 9, "color": "#F59E0B"},
        ],
    }


@router.get("/evaluations")
async def evaluations(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT e.*, u.first_name, u.last_name FROM performance_evaluations e
           LEFT JOIN users u ON u.id = e.user_id ORDER BY e.evaluation_date DESC LIMIT 100"""
    )
    return {
        "stats": {
            "planned": 285,
            "completed": sum(1 for r in rows if r["status"] == "completed"),
            "inProgress": sum(1 for r in rows if r["status"] == "in_progress"),
            "pending": sum(1 for r in rows if r["status"] == "pending"),
        },
        "evaluations": [
            {
                "name": f"{r.get('first_name','')} {r.get('last_name','')}".strip() or "Anonyme",
                "rating": float(r.get("rating", 0) or 0),
                "status": "Complété" if r["status"] == "completed" else r["status"],
                "date": r["evaluation_date"].strftime("%d %b %Y") if r.get("evaluation_date") else "—",
            }
            for r in rows
        ],
        "monthlyProgress": [
            {"month": "Jan", "completees": 25, "en_attente": 12},
            {"month": "Fév", "completees": 35, "en_attente": 15},
            {"month": "Mar", "completees": 50, "en_attente": 20},
            {"month": "Avr", "completees": 67, "en_attente": 21},
        ],
    }


@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {
        "data": [
            {"name": "Rapport Effectifs Mensuel", "type": "PDF", "date": "30 Avr 2025"},
            {"name": "Rapport Recrutement Q1", "type": "PDF", "date": "15 Avr 2025"},
            {"name": "Rapport Formation 2024", "type": "Excel", "date": "10 Jan 2025"},
            {"name": "Bilan Évaluations", "type": "PDF", "date": "5 Avr 2025"},
        ]
    }
