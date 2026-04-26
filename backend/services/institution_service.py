"""Institution + KPI aggregation services."""
from typing import Any

from db.supabase import fetch_all, fetch_one


DOMAIN_LABELS = {
    "academic": "Académique",
    "hr": "Ressources Humaines",
    "finance": "Finance",
    "research": "Recherche",
    "infrastructure": "Infrastructure",
    "employment": "Emploi",
    "partnerships": "Partenariats",
    "esg": "ESG / Développement Durable",
}


def _row_to_inst(r: dict) -> dict:
    return {
        "id": str(r["id"]),
        "name": r["name"],
        "code": r["code"],
        "type": r["type"],
        "city": r.get("city"),
        "establishedYear": r.get("established_year"),
        "totalStudents": r.get("total_students", 0),
        "totalStaff": r.get("total_staff", 0),
        "logoUrl": r.get("logo_url"),
        "accreditationStatus": r.get("accreditation_status") or [],
        "isActive": r.get("is_active", True),
    }


def list_institutions(
    search: str | None = None,
    inst_type: str | None = None,
    page: int = 1,
    limit: int = 35,
    accessible_ids: list[str] | None = None,
    can_access_all: bool = False,
) -> dict:
    where = ["is_active = true"]
    params: list[Any] = []
    if search:
        where.append("(LOWER(name) LIKE %s OR LOWER(code) LIKE %s)")
        params.extend([f"%{search.lower()}%", f"%{search.lower()}%"])
    if inst_type:
        where.append("type = %s")
        params.append(inst_type)
    if not can_access_all and accessible_ids is not None:
        if not accessible_ids:
            return {"data": [], "pagination": {"page": page, "limit": limit, "total": 0, "totalPages": 0}}
        where.append("id::text = ANY(%s)")
        params.append(accessible_ids)

    where_sql = " AND ".join(where)
    offset = (page - 1) * limit

    rows = fetch_all(
        f"SELECT * FROM institutions WHERE {where_sql} ORDER BY name LIMIT %s OFFSET %s",
        (*params, limit, offset),
    )
    total_row = fetch_one(f"SELECT COUNT(*) AS c FROM institutions WHERE {where_sql}", tuple(params))
    total = int(total_row["c"]) if total_row else 0

    return {
        "data": [_row_to_inst(r) for r in rows],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit if limit else 1,
        },
    }


def get_institution(inst_id: str) -> dict | None:
    row = fetch_one("SELECT * FROM institutions WHERE id = %s LIMIT 1", (inst_id,))
    return _row_to_inst(row) if row else None


def get_kpi_values(inst_id: str) -> list[dict]:
    rows = fetch_all(
        """SELECT kv.*, kd.name AS kpi_name, kd.category, kd.unit AS kpi_unit
           FROM kpi_values kv LEFT JOIN kpi_definitions kd ON kv.kpi_slug = kd.slug
           WHERE kv.institution_id = %s
           ORDER BY kd.category, kd.name""",
        (inst_id,),
    )
    return [
        {
            "institutionId": str(r["institution_id"]),
            "kpiSlug": r["kpi_slug"],
            "kpiName": r["kpi_name"] or r["kpi_slug"],
            "category": r.get("category", "academic"),
            "value": float(r["value"]) if r["value"] is not None else 0,
            "target": float(r["target"]) if r.get("target") is not None else None,
            "unit": r.get("unit") or r.get("kpi_unit") or "%",
            "trend": r.get("trend") or "stable",
            "trendValue": float(r["trend_value"]) if r.get("trend_value") is not None else 0,
            "period": r.get("period"),
            "isValidated": r.get("is_validated", False),
        }
        for r in rows
    ]


def get_domain_kpis(inst_id: str) -> list[dict]:
    kpis = get_kpi_values(inst_id)
    by_cat: dict[str, list[dict]] = {}
    for k in kpis:
        by_cat.setdefault(k["category"], []).append(k)

    domains = []
    for slug, label in DOMAIN_LABELS.items():
        items = by_cat.get(slug, [])
        if not items:
            score = 70
        else:
            scores = []
            for k in items:
                if k["target"] and k["target"] > 0:
                    scores.append(min(100, (k["value"] / k["target"]) * 100))
                else:
                    scores.append(50)
            score = sum(scores) / len(scores) if scores else 70

        status_label = "ok" if score >= 80 else "warning" if score >= 60 else "critical"
        domains.append(
            {
                "domain": slug,
                "domainLabel": label,
                "score": round(score),
                "target": 90,
                "status": status_label,
                "kpis": [
                    {"name": k["kpiName"], "value": k["value"], "target": k["target"], "unit": k["unit"]}
                    for k in items
                ],
            }
        )
    return domains


def aggregate_kpis(accessible_ids: list[str] | None = None, can_access_all: bool = True) -> dict:
    """UCAR-wide aggregate KPIs."""
    where = "1=1"
    params: list[Any] = []
    if not can_access_all and accessible_ids:
        where = "i.id::text = ANY(%s)"
        params.append(accessible_ids)

    students_row = fetch_one(f"SELECT COALESCE(SUM(total_students),0) AS s FROM institutions i WHERE {where}", tuple(params))
    staff_row = fetch_one(f"SELECT COALESCE(SUM(total_staff),0) AS s FROM institutions i WHERE {where}", tuple(params))
    inst_count = fetch_one(f"SELECT COUNT(*) AS c FROM institutions i WHERE {where}", tuple(params))

    avg_kpis = fetch_all(
        """SELECT kv.kpi_slug, AVG(kv.value) AS avg_v, AVG(kv.target) AS avg_t,
                  kd.name, kd.unit, kd.category
           FROM kpi_values kv LEFT JOIN kpi_definitions kd ON kv.kpi_slug = kd.slug
           GROUP BY kv.kpi_slug, kd.name, kd.unit, kd.category
           ORDER BY kd.category, kd.name"""
    )

    pubs = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1") or {"c": 0}
    anomaly_count = fetch_one("SELECT COUNT(*) AS c FROM anomalies WHERE status = 'pending'") or {"c": 0}

    return {
        "totalStudents": int(students_row["s"]) if students_row else 0,
        "totalStaff": int(staff_row["s"]) if staff_row else 0,
        "totalInstitutions": int(inst_count["c"]) if inst_count else 0,
        "publicationsRecent": int(pubs["c"]),
        "pendingAnomalies": int(anomaly_count["c"]),
        "kpis": [
            {
                "slug": r["kpi_slug"],
                "name": r.get("name") or r["kpi_slug"],
                "category": r.get("category"),
                "value": round(float(r["avg_v"] or 0), 2),
                "target": round(float(r["avg_t"] or 0), 2),
                "unit": r.get("unit") or "%",
            }
            for r in avg_kpis
        ],
    }
