"""Service Finances + Budget endpoints."""
from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import execute, fetch_all, fetch_one

router = APIRouter(prefix="/svc", tags=["svc_finances"])

FIN_SERVICE = {"slug": "svc_finances", "label": "Affaires Financières", "accentColor": "#059669"}
BUDGET_SERVICE = {"slug": "svc_budget", "label": "Service Budget", "accentColor": "#0891B2"}


@router.get("/finances/dashboard")
async def fin_dashboard(rbac: RBAC = Depends(get_current_user)):
    return {
        "service": FIN_SERVICE,
        "kpIs": [
            {"label": "Revenus", "value": 28.5, "unit": "MDT", "target": 30},
            {"label": "Taux Exécution", "value": 88.2, "unit": "%", "target": 95},
            {"label": "Trésorerie", "value": 7.85, "unit": "MDT", "target": 8},
            {"label": "Marchés Actifs", "value": 12, "unit": "", "target": 15},
        ],
        "trendChart": [{"month": m, "value": v} for m, v in zip(["Jan", "Fév", "Mar", "Avr", "Mai"], [85, 87, 88, 90, 88])],
        "distributionChart": [
            {"category": "Salaires", "value": 65},
            {"category": "Équipement", "value": 15},
            {"category": "Infrastructure", "value": 12},
            {"category": "Recherche", "value": 8},
        ],
    }


@router.get("/finances/tresorerie")
async def fin_tresorerie(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM accounts ORDER BY balance DESC")
    total = sum(float(r["balance"] or 0) for r in rows)
    return {
        "totalSolde": round(total / 1_000_000, 2),
        "unit": "MDT",
        "accounts": [
            {
                "name": r["name"],
                "bank": r.get("bank"),
                "solde": round(float(r["balance"] or 0) / 1_000_000, 2),
                "devise": r.get("currency", "TND"),
                "lastOp": r["last_op"].strftime("%d %b %Y") if r.get("last_op") else "—",
            }
            for r in rows
        ],
        "monthlyFlow": [
            {"month": "Jan", "entrées": 2.8, "sorties": 2.2},
            {"month": "Fév", "entrées": 3.1, "sorties": 2.5},
            {"month": "Mar", "entrées": 3.2, "sorties": 2.8},
            {"month": "Avr", "entrées": 2.9, "sorties": 2.6},
        ],
    }


@router.get("/finances/paiements")
async def fin_paiements(
    status: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    where = "1=1"
    params: list = []
    if status:
        where = "status = %s"
        params.append(status)
    rows = fetch_all(f"SELECT * FROM payments WHERE {where} ORDER BY payment_date DESC LIMIT %s OFFSET %s", (*params, limit, (page - 1) * limit))
    total = fetch_one(f"SELECT COUNT(*) AS c FROM payments WHERE {where}", tuple(params)) or {"c": 0}
    completed = fetch_one("SELECT COUNT(*) AS c FROM payments WHERE status IN ('Effectué','completed')") or {"c": 0}
    pending = fetch_one("SELECT COUNT(*) AS c FROM payments WHERE status = 'pending'") or {"c": 0}
    total_amount = fetch_one("SELECT COALESCE(SUM(amount),0) AS s FROM payments") or {"s": 0}
    return {
        "stats": {
            "completed": int(completed["c"]),
            "processing": 18,
            "pending": int(pending["c"]),
            "totalAmount": f"{float(total_amount['s'])/1_000_000:.2f}M DT",
        },
        "data": [
            {
                "id": str(r["id"]),
                "beneficiary": r["beneficiary"],
                "amount": float(r["amount"]),
                "service": r.get("service"),
                "status": r["status"],
                "date": r["payment_date"].strftime("%d %b %Y") if r.get("payment_date") else "—",
            }
            for r in rows
        ],
        "pagination": {"page": page, "limit": limit, "total": int(total["c"]), "totalPages": (int(total["c"]) + limit - 1) // limit},
    }


@router.post("/finances/paiements")
async def create_payment(payload: dict, rbac: RBAC = Depends(get_current_user)):
    execute(
        "INSERT INTO payments (beneficiary, amount, service, status, payment_date) VALUES (%s, %s, %s, COALESCE(%s,'pending'), CURRENT_DATE)",
        (payload.get("beneficiary"), payload.get("amount", 0), payload.get("service"), payload.get("status")),
    )
    return {"success": True}


@router.get("/finances/audits")
async def fin_audits(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM audits ORDER BY created_at DESC")
    return {
        "stats": {
            "completed": sum(1 for r in rows if r["status"] == "Clôturé"),
            "inProgress": sum(1 for r in rows if r["status"] == "En cours"),
            "findings": sum(int(r.get("findings", 0) or 0) for r in rows),
            "critical": sum(int(r.get("critical", 0) or 0) for r in rows),
        },
        "audits": [
            {
                "id": r["audit_ref"],
                "service": r.get("service"),
                "type": r.get("audit_type"),
                "findings": int(r.get("findings", 0) or 0),
                "critical": int(r.get("critical", 0) or 0),
                "status": r["status"],
            }
            for r in rows
        ],
        "findingsByCategory": [
            {"category": "Financier", "count": 18},
            {"category": "Procédures", "count": 12},
            {"category": "Conformité", "count": 8},
        ],
    }


@router.get("/finances/marches")
async def fin_marches(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM offre_calls WHERE status NOT IN ('predicted') ORDER BY created_at DESC LIMIT 50")
    return {
        "stats": {
            "active": sum(1 for r in rows if r["status"] in ("drafted", "published", "evaluation")),
            "published": sum(1 for r in rows if r["status"] == "published"),
            "awarded": sum(1 for r in rows if r["status"] == "awarded"),
            "inEvaluation": sum(1 for r in rows if r["status"] == "evaluation"),
        },
        "data": [
            {
                "ref": str(r["id"])[:10],
                "title": r["title"],
                "budget": float(r.get("budget_estimated") or 0),
                "dept": r.get("service_id", "—"),
                "status": r["status"],
                "deadline": r["deadline"].strftime("%d %b %Y") if r.get("deadline") else "—",
            }
            for r in rows
        ],
    }


@router.get("/finances/appels-offres")
async def fin_appels_offres(rbac: RBAC = Depends(get_current_user)):
    preds = fetch_all("SELECT * FROM offre_calls WHERE status = 'predicted' ORDER BY ai_probability DESC LIMIT 10")
    active = fetch_all("SELECT * FROM offre_calls WHERE status IN ('drafted','published','evaluation') ORDER BY created_at DESC")
    closed = fetch_one("SELECT COUNT(*) AS c FROM offre_calls WHERE status IN ('awarded','closed')") or {"c": 0}
    total_budget = fetch_one("SELECT COALESCE(SUM(budget_estimated), 0) AS s FROM offre_calls") or {"s": 0}
    return {
        "stats": {
            "predictions": len(preds),
            "active": len(active),
            "closed": int(closed["c"]),
            "totalBudget": f"{float(total_budget['s'])/1_000_000:.2f}M DT",
        },
        "predictions": [
            {
                "title": p["title"],
                "budget": float(p.get("budget_estimated") or 0),
                "probability": int(p.get("ai_probability") or 0),
                "deadline": p["deadline"].strftime("%b %Y") if p.get("deadline") else "—",
            }
            for p in preds
        ],
    }


# ─── BUDGET ───
@router.get("/budget/dashboard")
async def budget_dashboard(rbac: RBAC = Depends(get_current_user)):
    total = fetch_one("SELECT COALESCE(SUM(allocated),0) AS a, COALESCE(SUM(consumed),0) AS c FROM budget_allocations WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int")
    return {
        "service": BUDGET_SERVICE,
        "kpIs": [
            {"label": "Allocation Totale", "value": float((total or {}).get("a", 0)) / 1_000_000, "unit": "MDT", "target": 90},
            {"label": "Exécution", "value": round(float((total or {}).get("c", 0)) / max(float((total or {}).get("a", 1)), 1) * 100, 1), "unit": "%", "target": 95},
            {"label": "Prévisions 2026", "value": 88, "unit": "MDT", "target": 92},
        ],
    }


@router.get("/budget/allocations")
async def budget_allocations(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT i.code AS name, COALESCE(SUM(b.allocated),0) AS budget
           FROM institutions i LEFT JOIN budget_allocations b ON b.institution_id = i.id AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)::int
           GROUP BY i.id, i.code ORDER BY budget DESC"""
    )
    total_alloc = fetch_one("SELECT COALESCE(SUM(allocated),0) AS s FROM budget_allocations WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int") or {"s": 0}
    by_service = fetch_all(
        """SELECT service_id AS name, COALESCE(SUM(allocated),0) AS budget
           FROM budget_allocations WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int AND service_id IS NOT NULL
           GROUP BY service_id ORDER BY budget DESC"""
    )
    palette = ["#7C3AED", "#059669", "#2563EB", "#F59E0B", "#0891B2", "#9333EA", "#EF4444"]
    return {
        "stats": {
            "total": f"{float(total_alloc['s'])/1_000_000:.1f}M DT",
            "allocated": f"{float(total_alloc['s'])/1_000_000:.1f}M DT",
            "reserved": f"{float(total_alloc['s'])*0.05/1_000_000:.1f}M DT",
        },
        "byService": [
            {"name": s.get("name") or "—", "budget": round(float(s["budget"]) / 1_000_000, 1), "color": palette[i % len(palette)]}
            for i, s in enumerate(by_service)
        ],
        "byInstitution": [{"name": r["name"], "budget": round(float(r["budget"]) / 1_000_000, 1)} for r in rows],
    }


@router.get("/budget/execution")
async def budget_execution(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT category AS name, COALESCE(SUM(allocated),0) AS alloue, COALESCE(SUM(consumed),0) AS consomme
           FROM budget_allocations WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int
           GROUP BY category"""
    )
    total = fetch_one("SELECT COALESCE(SUM(allocated),0) AS a, COALESCE(SUM(consumed),0) AS c FROM budget_allocations WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int") or {}
    a = float(total.get("a", 0))
    c = float(total.get("c", 0))
    return {
        "stats": {
            "allocated": f"{a/1_000_000:.1f}M DT",
            "consumed": f"{c/1_000_000:.1f}M DT",
            "rate": round((c / max(a, 1)) * 100, 1),
            "overspend": 3,
        },
        "monthlyCumulative": [
            {"month": m, "alloue": round(a * f / 1_000_000, 1), "consomme": round(c * f / 1_000_000, 1)}
            for m, f in zip(["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"], [0.10, 0.22, 0.36, 0.50, 0.65, 0.80])
        ],
        "byService": [
            {
                "name": r["name"] or "—",
                "alloue": round(float(r["alloue"]) / 1_000_000, 1),
                "consomme": round(float(r["consomme"]) / 1_000_000, 1),
                "taux": round(float(r["consomme"]) / max(float(r["alloue"]), 1) * 100, 1),
            }
            for r in rows
        ],
    }


@router.get("/budget/previsions")
async def budget_previsions(rbac: RBAC = Depends(get_current_user)):
    return {
        "historical": [
            {"year": 2021, "reel": 72.0, "prevu": 70.0},
            {"year": 2022, "reel": 76.5, "prevu": 75.0},
            {"year": 2023, "reel": 79.0, "prevu": 78.0},
            {"year": 2024, "reel": 82.5, "prevu": 81.0},
            {"year": 2025, "reel": 85.0, "prevu": 83.0},
        ],
        "scenarios": [
            {"name": "Scénario Pessimiste", "budget": 82.0, "probability": 20, "description": "Ralentissement des recettes"},
            {"name": "Scénario Réaliste", "budget": 88.0, "probability": 55, "description": "Croissance stable +8%"},
            {"name": "Scénario Optimiste", "budget": 92.5, "probability": 25, "description": "Recettes additionnelles UE"},
        ],
    }


@router.get("/budget/comparaisons")
async def budget_comparaisons(sortBy: str = Query("budget"), rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT i.code AS name,
                  COALESCE(SUM(b.allocated),0)/1000000 AS budget,
                  COALESCE(SUM(b.consumed),0) / NULLIF(SUM(b.allocated),0) * 100 AS execution
           FROM institutions i LEFT JOIN budget_allocations b ON b.institution_id = i.id
           GROUP BY i.code ORDER BY budget DESC"""
    )
    return {
        "data": [
            {
                "name": r["name"],
                "budget": round(float(r["budget"] or 0), 1),
                "execution": round(float(r["execution"] or 0), 1),
                "prevision": round(float(r["budget"] or 0) * 1.05, 1),
            }
            for r in rows
        ]
    }
