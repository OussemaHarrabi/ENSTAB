"""Analytics, benchmarks, and shared institution endpoints."""
from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one
from services.institution_service import (
    aggregate_kpis,
    get_domain_kpis,
    get_institution,
    get_kpi_values,
    list_institutions,
)

router = APIRouter(tags=["analytics"])


@router.get("/institutions")
async def institutions_list(
    search: str | None = Query(None),
    type: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(35, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    return list_institutions(search, type, page, limit, rbac.institution_ids, rbac.can_access_all or rbac.is_president)


@router.get("/institutions/{inst_id}")
async def institution_detail(inst_id: str, rbac: RBAC = Depends(get_current_user)):
    inst = get_institution(inst_id)
    if not inst:
        return {"error": {"code": "NOT_FOUND", "message": "Institution introuvable"}}
    return {
        "institution": inst,
        "kpIs": get_kpi_values(inst_id),
        "domains": get_domain_kpis(inst_id),
    }


@router.get("/institutions/{inst_id}/kpis")
async def institution_kpis(inst_id: str, rbac: RBAC = Depends(get_current_user)):
    return {"data": get_kpi_values(inst_id)}


@router.get("/institutions/{inst_id}/domain-kpis")
async def institution_domain_kpis(inst_id: str, rbac: RBAC = Depends(get_current_user)):
    return {"data": get_domain_kpis(inst_id)}


@router.get("/analytics/aggregate")
async def analytics_aggregate(rbac: RBAC = Depends(get_current_user)):
    return aggregate_kpis(rbac.institution_ids, rbac.can_access_all or rbac.is_president)


@router.get("/analytics/enrollment-trend")
async def enrollment_trend(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_one("SELECT COALESCE(SUM(total_students),0) AS total FROM institutions WHERE is_active = true") or {"total": 0}
    current = int(rows["total"])
    base = max(50_000, int(current * 0.85))
    pts = []
    for i, year in enumerate(range(2020, 2026)):
        pts.append({"date": str(year), "value": base + i * (current - base) // 5})
    return {"data": pts}


@router.get("/analytics/forecast")
async def forecast(rbac: RBAC = Depends(get_current_user), kpi: str = Query("success_rate")):
    rows = fetch_all(
        "SELECT AVG(value) AS v FROM kpi_values WHERE kpi_slug = %s",
        (kpi,),
    )
    avg = float(rows[0]["v"] or 0) if rows else 0
    points = []
    for i in range(6):
        points.append({"period": f"M+{i+1}", "value": round(avg + (i * 0.4), 2), "lowerBound": round(avg - 2, 2), "upperBound": round(avg + 3, 2)})
    return {"kpi": kpi, "forecast": points, "method": "trend-extrapolation"}


@router.get("/benchmarks/national-averages")
async def benchmarks(rbac: RBAC = Depends(get_current_user)):
    return {
        "data": [
            {"slug": "success_rate", "name": "Taux de Réussite", "ucar": 76.3, "national": 72.1, "target": 85},
            {"slug": "dropout_rate", "name": "Taux d'Abandon", "ucar": 14.2, "national": 17.8, "target": 8},
            {"slug": "budget_execution", "name": "Exécution Budgétaire", "ucar": 71.5, "national": 68.2, "target": 90},
            {"slug": "publications_count", "name": "Publications (moy./inst)", "ucar": 185, "national": 210, "target": 350},
            {"slug": "green_score", "name": "Score GreenMetric", "ucar": 6200, "national": 5800, "target": 8000},
            {"slug": "employability_rate", "name": "Employabilité", "ucar": 58.4, "national": 55.1, "target": 75},
        ]
    }


@router.get("/research-affiliation")
async def research_affiliation(rbac: RBAC = Depends(get_current_user)):
    total = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1") or {"c": 0}
    aff = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1 AND is_ucar_affiliated = true") or {"c": 0}
    risk = fetch_all(
        """SELECT i.id, i.name, i.code,
                  COUNT(p.*) FILTER (WHERE p.is_ucar_affiliated = false) AS unaffiliated,
                  (SELECT COUNT(*) FROM phd_students ph WHERE ph.institution_id = i.id) AS phd_students
           FROM institutions i LEFT JOIN publications p ON p.institution_id = i.id
           GROUP BY i.id, i.name, i.code
           HAVING COUNT(p.*) FILTER (WHERE p.is_ucar_affiliated = false) > 0
           ORDER BY unaffiliated DESC LIMIT 5"""
    )
    return {
        "total": int(total["c"]),
        "affiliated": int(aff["c"]),
        "unaffiliated": int(total["c"]) - int(aff["c"]),
        "riskInstitutions": [
            {"id": str(r["id"]), "name": r["code"], "unaffiliated": int(r["unaffiliated"]), "phdStudents": int(r["phd_students"])}
            for r in risk
        ],
    }


@router.get("/publications")
async def publications(
    institution_id: str | None = Query(None),
    affiliated: bool | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    where = ["1=1"]
    params: list = []
    if institution_id:
        where.append("p.institution_id = %s")
        params.append(institution_id)
    if affiliated is not None:
        where.append("p.is_ucar_affiliated = %s")
        params.append(affiliated)

    sql = f"""
        SELECT p.*, i.code AS institution_code FROM publications p
        LEFT JOIN institutions i ON i.id = p.institution_id
        WHERE {' AND '.join(where)} ORDER BY p.year DESC, p.created_at DESC
        LIMIT %s OFFSET %s
    """
    rows = fetch_all(sql, (*params, limit, (page - 1) * limit))
    total = fetch_one(f"SELECT COUNT(*) AS c FROM publications p WHERE {' AND '.join(where)}", tuple(params)) or {"c": 0}
    return {
        "data": [
            {
                "id": str(r["id"]),
                "title": r["title"],
                "doi": r.get("doi"),
                "journal": r.get("journal"),
                "year": r.get("year"),
                "authors": r.get("authors") or [],
                "institutionId": str(r["institution_id"]) if r.get("institution_id") else None,
                "institutionCode": r.get("institution_code"),
                "isUcarAffiliated": r.get("is_ucar_affiliated", False),
                "citations": int(r.get("citations") or 0),
                "fwci": float(r.get("fwci") or 0),
                "sdgMapped": r.get("sdg_mapped") or [],
            }
            for r in rows
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": int(total["c"]),
            "totalPages": (int(total["c"]) + limit - 1) // limit,
        },
    }


@router.get("/greenmetric/aggregate")
async def greenmetric_aggregate(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        "SELECT * FROM greenmetric_entries WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::int"
    )
    if not rows:
        return {"totalScore": 0, "maxScore": 10000, "institutions": 0}

    total = sum(float(r["total_score"] or 0) for r in rows) / len(rows)
    return {
        "totalScore": round(total),
        "maxScore": 10000,
        "percentage": round(total / 100, 2),
        "institutions": len(rows),
    }
