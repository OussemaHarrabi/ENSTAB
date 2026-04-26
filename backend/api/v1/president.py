"""Présidence (executive) endpoints."""
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

router = APIRouter(prefix="/president", tags=["president"])


@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    agg = aggregate_kpis(rbac.institution_ids, rbac.can_access_all or rbac.is_president)

    # Map a few KPIs to the dashboard summary cards
    by_slug = {k["slug"]: k for k in agg["kpis"]}
    success = by_slug.get("success_rate", {"value": 0, "target": 85})
    budget = by_slug.get("budget_execution", {"value": 0, "target": 95})
    pubs = by_slug.get("publications_count", {"value": 0, "target": 350})
    green = by_slug.get("green_score", {"value": 0, "target": 7500})

    kpis = [
        {"title": "Étudiants", "value": agg["totalStudents"], "unit": "", "target": agg["totalStudents"] + 1000, "trend": "up", "trendValue": 3.2, "sparkline": [agg["totalStudents"] - i * 300 for i in range(7, 0, -1)]},
        {"title": "Taux Réussite", "value": round(success.get("value", 0)), "unit": "%", "target": round(success.get("target", 85)), "trend": "up", "trendValue": 2.1},
        {"title": "Budget Exécuté", "value": round(budget.get("value", 0)), "unit": "%", "target": round(budget.get("target", 95)), "trend": "up", "trendValue": 1.5},
        {"title": "Publications", "value": agg["publicationsRecent"], "unit": "", "target": round(pubs.get("target", 400)), "trend": "up", "trendValue": 8.7},
        {"title": "Score GreenMetric", "value": round(green.get("value", 0)), "unit": "", "target": round(green.get("target", 7500)), "trend": "up", "trendValue": 4.3},
        {"title": "Classement THE", "value": 401, "unit": "", "target": 350, "trend": "up", "trendValue": -12.5},
    ]

    insts = fetch_all("SELECT id, code FROM institutions WHERE is_active = true ORDER BY code LIMIT 35")
    traffic_light = []
    for inst in insts:
        domains = get_domain_kpis(str(inst["id"]))
        traffic_light.append(
            {
                "institutionId": str(inst["id"]),
                "institutionName": inst["code"],
                "domains": [{"domain": d["domain"], "score": d["score"], "status": d["status"]} for d in domains[:4]],
            }
        )

    pending_decisions = fetch_one("SELECT COUNT(*) AS c FROM official_decisions WHERE status IN ('draft','pending')") or {"c": 0}
    return {
        "kpis": kpis,
        "rankingProgress": [
            {"year": 2020, "the": 1201, "qs": 1400, "greenmetric": 350},
            {"year": 2021, "the": 1100, "qs": 1300, "greenmetric": 320},
            {"year": 2022, "the": 901, "qs": 1100, "greenmetric": 280},
            {"year": 2023, "the": 601, "qs": 801, "greenmetric": 220},
            {"year": 2024, "the": 501, "qs": 651, "greenmetric": 175},
            {"year": 2025, "the": 401, "qs": 551, "greenmetric": 120},
        ],
        "greenMetricCriteria": [
            {"name": "Infrastructure", "score": 85, "max": 100},
            {"name": "Énergie & Climat", "score": 72, "max": 100},
            {"name": "Déchets", "score": 78, "max": 100},
            {"name": "Eau", "score": 81, "max": 100},
            {"name": "Transport", "score": 65, "max": 100},
            {"name": "Éducation", "score": 88, "max": 100},
        ],
        "trafficLight": traffic_light,
        "anomalyCount": agg["pendingAnomalies"],
        "pendingDecisions": int(pending_decisions["c"]),
    }


@router.get("/greenmetric")
async def greenmetric(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT g.*, i.name AS inst_name, i.code AS inst_code
           FROM greenmetric_entries g JOIN institutions i ON i.id = g.institution_id
           WHERE g.year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
           ORDER BY g.total_score DESC"""
    )
    total = sum(float(r["total_score"]) for r in rows) if rows else 0
    avg = total / max(1, len(rows))
    max_total = max((float(r.get("max_score") or 10000) for r in rows), default=10000)

    # Aggregate criteria
    def avg_field(name: str, max_field: str) -> dict:
        if not rows:
            return {"score": 0, "max": 0, "percentage": 0}
        s = sum(float(r[name] or 0) for r in rows) / len(rows)
        m = sum(float(r[max_field] or 0) for r in rows) / len(rows)
        return {"score": round(s), "max": round(m), "percentage": round((s / m * 100) if m else 0, 1)}

    return {
        "totalScore": round(avg),
        "maxScore": round(max_total),
        "percentage": round((avg / max_total * 100) if max_total else 0, 2),
        "worldRank": 145,
        "nationalRank": 1,
        "trend": {"year": 2021, "score": 5200, "rank": 220},
        "criteria": [
            {"name": "Infrastructure", **avg_field("setting_infrastructure_score", "setting_infrastructure_max"), "trend": "+2.1%"},
            {"name": "Énergie & Climat", **avg_field("energy_climate_score", "energy_climate_max"), "trend": "+4.3%"},
            {"name": "Déchets", **avg_field("waste_score", "waste_max"), "trend": "+3.5%"},
            {"name": "Eau", **avg_field("water_score", "water_max"), "trend": "+1.8%"},
            {"name": "Transport", **avg_field("transportation_score", "transportation_max"), "trend": "+5.2%"},
            {"name": "Éducation", **avg_field("education_score", "education_max"), "trend": "+2.9%"},
            {"name": "Gouvernance", **avg_field("governance_score", "governance_max"), "trend": "+0.8%"},
        ],
        "historical": [
            {"year": 2020, "score": 4800, "target": 5000},
            {"year": 2021, "score": 5200, "target": 5500},
            {"year": 2022, "score": 5800, "target": 6000},
            {"year": 2023, "score": 6300, "target": 6500},
            {"year": 2024, "score": 6500, "target": 7000},
            {"year": 2025, "score": round(avg), "target": 7500},
        ],
        "institutions": [
            {"name": r["inst_code"], "score": round(float(r["total_score"]) / float(r.get("max_score") or 10000) * 100, 1), "rank": idx + 1, "trend": "up" if idx % 2 == 0 else "down"}
            for idx, r in enumerate(rows)
        ],
        "recommendations": [
            {"title": "Transport", "description": "Prioriser navettes électriques pour gagner 850 points", "impact": 850},
            {"title": "Recyclage", "description": "Programme de tri sélectif sur tous les campus", "impact": 420},
            {"title": "Énergie solaire", "description": "Installation de panneaux solaires sur 5 bâtiments", "impact": 680},
        ],
    }


@router.get("/rankings")
async def rankings_overview(rbac: RBAC = Depends(get_current_user)):
    return {
        "rankings": [
            {"system": "THE World University Rankings", "rank2025": 401, "rank2024": 501, "rank2023": 601, "score2025": 38.5, "target2026": 350, "color": "#2563EB"},
            {"system": "QS World University Rankings", "rank2025": 551, "rank2024": 651, "rank2023": 801, "score2025": 32.0, "target2026": 500, "color": "#7C3AED"},
            {"system": "UI GreenMetric", "rank2025": 120, "rank2024": 175, "rank2023": 220, "score2025": 6500, "target2026": 100, "color": "#16A34A"},
            {"system": "THE Impact Rankings", "rank2025": 401, "rank2024": 501, "rank2023": 601, "score2025": 55.0, "target2026": 350, "color": "#F59E0B"},
        ],
        "competitors": [
            {"name": "UCAR", "the": 401, "qs": 551, "greenmetric": 120},
            {"name": "Université de Tunis El Manar", "the": 501, "qs": 651, "greenmetric": 150},
            {"name": "Université de Sfax", "the": 601, "qs": 801, "greenmetric": 180},
            {"name": "Université de la Manouba", "the": 801, "qs": 1001, "greenmetric": 200},
        ],
        "kpiGaps": [
            {"kpi": "Publications par chercheur", "value": 1.8, "target": 2.5, "weight": "Très haut", "impact": "+80 places"},
            {"kpi": "Citations par publication", "value": 8.2, "target": 12, "weight": "Haut", "impact": "+45 places"},
            {"kpi": "Étudiants internationaux", "value": 8, "target": 15, "weight": "Moyen", "impact": "+25 places"},
        ],
        "historical": [
            {"year": 2021, "the": 1201, "qs": 1400, "greenmetric": 350},
            {"year": 2022, "the": 1100, "qs": 1300, "greenmetric": 280},
            {"year": 2023, "the": 901, "qs": 1100, "greenmetric": 220},
            {"year": 2024, "the": 501, "qs": 651, "greenmetric": 175},
            {"year": 2025, "the": 401, "qs": 551, "greenmetric": 120},
        ],
    }


@router.get("/compliance")
async def compliance(rbac: RBAC = Depends(get_current_user)):
    return {
        "standards": [
            {
                "name": "ISO 21001",
                "label": "Systèmes de management pour l'éducation",
                "progress": 72,
                "deadline": "Juin 2026",
                "color": "#2563EB",
                "stages": [
                    {"label": "Diagnostic initial", "done": True, "date": "Jan 2025"},
                    {"label": "Définition processus", "done": True, "date": "Mars 2025"},
                    {"label": "Audit blanc", "done": False, "date": "Sept 2025"},
                    {"label": "Certification", "done": False, "date": "Juin 2026"},
                ],
            },
            {
                "name": "ISO 14001",
                "label": "Management environnemental",
                "progress": 45,
                "deadline": "Déc 2026",
                "color": "#16A34A",
                "stages": [
                    {"label": "Audit énergétique", "done": True, "date": "Fév 2025"},
                    {"label": "Plan environnemental", "done": False, "date": "Juin 2025"},
                    {"label": "Mise en œuvre", "done": False, "date": "Mars 2026"},
                ],
            },
            {
                "name": "ISO 9001",
                "label": "Management de la qualité",
                "progress": 92,
                "deadline": "Renouvellement Mars 2026",
                "color": "#9333EA",
                "stages": [
                    {"label": "Audit interne", "done": True, "date": "Jan 2025"},
                    {"label": "Revue de direction", "done": True, "date": "Fév 2025"},
                    {"label": "Audit de renouvellement", "done": False, "date": "Mars 2026"},
                ],
            },
        ],
        "complianceTrend": [
            {"month": "Jan 2025", "items": 5, "completed": 5},
            {"month": "Fév 2025", "items": 8, "completed": 7},
            {"month": "Mars 2025", "items": 12, "completed": 10},
            {"month": "Avr 2025", "items": 15, "completed": 12},
        ],
        "upcomingAudits": [
            {"service": "Service RH", "type": "Audit RH", "date": "15 Mai 2025", "priority": "high"},
            {"service": "Service Finances", "type": "Audit Financier", "date": "30 Mai 2025", "priority": "high"},
            {"service": "Service IT", "type": "Audit Sécurité", "date": "10 Juin 2025", "priority": "medium"},
        ],
    }


@router.get("/recherche")
async def recherche(rbac: RBAC = Depends(get_current_user)):
    pubs_total = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year = 2025") or {"c": 0}
    pubs_aff = fetch_one("SELECT COUNT(*) AS c FROM publications WHERE year = 2025 AND is_ucar_affiliated = true") or {"c": 0}
    projects = fetch_one("SELECT COUNT(*) AS c FROM research_projects WHERE status = 'En cours'") or {"c": 0}
    phds = fetch_one("SELECT COUNT(*) AS c FROM phd_students") or {"c": 0}

    inst_pubs = fetch_all(
        """SELECT i.code AS name, i.name AS full_name,
                  COUNT(p.*) AS publications,
                  COUNT(p.*) FILTER (WHERE p.is_ucar_affiliated = true) AS affiliated,
                  i.total_staff AS researchers
           FROM institutions i LEFT JOIN publications p ON p.institution_id = i.id AND p.year = 2025
           GROUP BY i.id, i.code, i.name, i.total_staff
           ORDER BY publications DESC LIMIT 7"""
    )

    affiliation_trend = fetch_all(
        """SELECT year::text AS year,
                  COUNT(*) AS total,
                  COUNT(*) FILTER (WHERE is_ucar_affiliated = true) AS affiliated,
                  COUNT(*) FILTER (WHERE is_ucar_affiliated = false) AS unaffiliated
           FROM publications WHERE year >= 2021 GROUP BY year ORDER BY year"""
    )

    at_risk = fetch_all(
        """SELECT p.title, i.code AS institution, array_to_string(p.authors, ', ') AS authors, p.year
           FROM publications p LEFT JOIN institutions i ON i.id = p.institution_id
           WHERE p.is_ucar_affiliated = false ORDER BY p.year DESC LIMIT 10"""
    )

    return {
        "kpIs": {
            "publications2025": int(pubs_total["c"]),
            "affiliationRate": round((int(pubs_aff["c"]) / max(1, int(pubs_total["c"]))) * 100, 1),
            "activeResearchers": 1245,
            "phdStudents": int(phds["c"]),
            "activeProjects": int(projects["c"]),
        },
        "affiliationTrend": [
            {
                "year": r["year"],
                "total": int(r["total"]),
                "affiliated": int(r["affiliated"]),
                "unaffiliated": int(r["unaffiliated"]),
            }
            for r in affiliation_trend
        ] or [
            {"year": "2021", "total": 320, "affiliated": 210, "unaffiliated": 110},
            {"year": "2022", "total": 365, "affiliated": 245, "unaffiliated": 120},
            {"year": "2023", "total": 410, "affiliated": 305, "unaffiliated": 105},
            {"year": "2024", "total": 432, "affiliated": 358, "unaffiliated": 74},
            {"year": "2025", "total": 458, "affiliated": 385, "unaffiliated": 73},
        ],
        "topInstitutions": [
            {
                "name": r["name"],
                "publications": int(r["publications"]),
                "affiliated": int(r["affiliated"]),
                "rate": round((int(r["affiliated"]) / max(1, int(r["publications"]))) * 100, 1),
                "researchers": int(r["researchers"] or 0),
            }
            for r in inst_pubs
        ],
        "projectsByType": [
            {"name": "Projets Nationaux", "count": 18, "funding": 4.5, "color": "#2563EB"},
            {"name": "PRF", "count": 12, "funding": 3.2, "color": "#7C3AED"},
            {"name": "UE H2020", "count": 8, "funding": 5.6, "color": "#16A34A"},
            {"name": "Banque Mondiale", "count": 5, "funding": 3.3, "color": "#F59E0B"},
        ],
        "atRiskPublications": [
            {"title": r["title"], "institution": r.get("institution") or "—", "authors": r.get("authors") or "—", "year": r.get("year")}
            for r in at_risk
        ],
        "researcherStats": {"professeurs": 245, "mcf": 380, "ma": 420, "hdr": 185},
    }


@router.get("/anomalies")
async def list_anomalies(
    severity: str | None = Query(None),
    status: str | None = Query(None),
    institution: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    rbac: RBAC = Depends(get_current_user),
):
    where = ["1=1"]
    params: list = []
    if severity:
        where.append("a.severity = %s")
        params.append(severity)
    if status:
        where.append("a.status = %s")
        params.append(status)
    if institution:
        where.append("(i.code ILIKE %s OR a.institution_id::text = %s)")
        params.extend([f"%{institution}%", institution])

    sql = f"""
        SELECT a.*, i.code AS institution_code, i.name AS institution_name
        FROM anomalies a LEFT JOIN institutions i ON i.id = a.institution_id
        WHERE {' AND '.join(where)}
        ORDER BY a.detected_at DESC
        LIMIT %s OFFSET %s
    """
    rows = fetch_all(sql, (*params, limit, (page - 1) * limit))
    total = fetch_one(
        f"SELECT COUNT(*) AS c FROM anomalies a LEFT JOIN institutions i ON i.id = a.institution_id WHERE {' AND '.join(where)}",
        tuple(params),
    ) or {"c": 0}

    summary = {
        s: int((fetch_one("SELECT COUNT(*) AS c FROM anomalies WHERE status = %s", (s,)) or {"c": 0})["c"])
        for s in ("pending", "acknowledged", "investigating", "false_positive")
    }
    summary["falsePositive"] = summary.pop("false_positive")

    return {
        "data": [
            {
                "id": str(r["id"]),
                "institutionId": str(r["institution_id"]) if r["institution_id"] else None,
                "institutionName": r.get("institution_code") or r.get("institution_name") or "—",
                "domain": r.get("domain_slug"),
                "severity": r.get("severity"),
                "title": r["title"],
                "description": r.get("description"),
                "shapFactors": r.get("shap_factors") or [],
                "timestamp": r["detected_at"].isoformat() if r.get("detected_at") else None,
                "status": r.get("status"),
            }
            for r in rows
        ],
        "summary": summary,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": int(total["c"]),
            "totalPages": (int(total["c"]) + limit - 1) // limit if limit else 1,
        },
    }


@router.put("/anomalies/{anomaly_id}/status")
async def update_anomaly_status(
    anomaly_id: str,
    payload: dict,
    rbac: RBAC = Depends(get_current_user),
):
    new_status = payload.get("status")
    notes = payload.get("notes")
    if new_status not in {"pending", "acknowledged", "investigating", "false_positive"}:
        return {"error": {"code": "INVALID_STATUS", "message": "Statut invalide"}}
    from db.supabase import execute

    execute(
        "UPDATE anomalies SET status = %s, notes = COALESCE(%s, notes), resolved_by = %s, resolved_at = CASE WHEN %s IN ('false_positive') THEN now() ELSE resolved_at END WHERE id = %s",
        (new_status, notes, rbac.user_id, new_status, anomaly_id),
    )
    row = fetch_one("SELECT * FROM anomalies WHERE id = %s", (anomaly_id,))
    return {"id": str(row["id"]), "status": row["status"], "notes": row.get("notes")}


@router.get("/appels-offres")
async def appels_offres(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all("SELECT * FROM offre_calls ORDER BY created_at DESC LIMIT 30")
    predictions = [r for r in rows if r["status"] == "predicted"]
    active = [r for r in rows if r["status"] in ("drafted", "published", "evaluation")]

    def to_dict(r: dict) -> dict:
        return {
            "id": str(r["id"]),
            "title": r["title"],
            "service": r.get("service_id"),
            "budget": float(r["budget_estimated"] or 0),
            "probability": int(r.get("ai_probability") or 0),
            "deadline": r["deadline"].isoformat() if r.get("deadline") else None,
            "status": r["status"],
        }

    total_budget = sum(float(r["budget_estimated"] or 0) for r in rows)
    return {
        "predictions": [to_dict(r) for r in predictions],
        "active": [{**to_dict(r), "responses": 4} for r in active],
        "stats": {
            "predictions": len(predictions),
            "active": len(active),
            "totalBudget": f"{total_budget/1_000_000:.2f}M" if total_budget else "0",
            "savings": "12%",
        },
    }


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

    kpis = get_kpi_values(inst_id)
    domains = get_domain_kpis(inst_id)

    cat_avg = {}
    for k in kpis:
        cat_avg.setdefault(k["category"], []).append((k["value"], k["target"] or 0))

    category_averages = [
        {
            "category": cat,
            "avgValue": round(sum(v for v, _ in items) / len(items), 1),
            "avgTarget": round(sum(t for _, t in items) / len(items), 1),
        }
        for cat, items in cat_avg.items()
    ]

    gm = fetch_one(
        "SELECT * FROM greenmetric_entries WHERE institution_id = %s AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int LIMIT 1",
        (inst_id,),
    )
    rkgs = fetch_all("SELECT * FROM rankings WHERE institution_id = %s ORDER BY year DESC LIMIT 5", (inst_id,))
    anos = fetch_all(
        "SELECT id, severity, title, description FROM anomalies WHERE institution_id = %s ORDER BY detected_at DESC LIMIT 10",
        (inst_id,),
    )

    return {
        "institution": inst,
        "kpIs": [
            {"kpiName": k["kpiName"], "value": k["value"], "target": k["target"], "unit": k["unit"], "trend": k["trend"], "trendValue": k["trendValue"]}
            for k in kpis
        ],
        "domains": domains,
        "categoryAverages": category_averages,
        "greenMetric": (
            {
                "year": gm["year"],
                "totalScore": float(gm["total_score"]),
                "maxScore": float(gm["max_score"]),
                "criteria": {
                    "settingInfrastructure": {"score": float(gm["setting_infrastructure_score"]), "max": float(gm["setting_infrastructure_max"])},
                    "energyClimate": {"score": float(gm["energy_climate_score"]), "max": float(gm["energy_climate_max"])},
                    "waste": {"score": float(gm["waste_score"]), "max": float(gm["waste_max"])},
                    "water": {"score": float(gm["water_score"]), "max": float(gm["water_max"])},
                    "transportation": {"score": float(gm["transportation_score"]), "max": float(gm["transportation_max"])},
                    "education": {"score": float(gm["education_score"]), "max": float(gm["education_max"])},
                    "governance": {"score": float(gm["governance_score"]), "max": float(gm["governance_max"])},
                },
            }
            if gm
            else None
        ),
        "rankings": [
            {"rankingSystem": r["ranking_system"], "rank": r["rank"], "year": r["year"], "score": float(r["score"] or 0)}
            for r in rkgs
        ],
        "anomalies": [
            {"id": str(r["id"]), "severity": r["severity"], "title": r["title"], "description": r.get("description")}
            for r in anos
        ],
    }


@router.get("/comparaisons")
async def comparaisons(
    kpi: str = Query("success_rate"),
    institutions: str | None = Query(None),
    rbac: RBAC = Depends(get_current_user),
):
    codes = institutions.split(",") if institutions else []
    where_extra = ""
    params: list = [kpi]
    if codes:
        where_extra = " AND i.code = ANY(%s)"
        params.append(codes)

    rows = fetch_all(
        f"""SELECT i.id, i.name, i.code, kv.value, kv.target,
                  (SELECT AVG(value) FROM kpi_values WHERE kpi_slug = %s) AS avg
           FROM institutions i LEFT JOIN kpi_values kv ON kv.institution_id = i.id AND kv.kpi_slug = %s
           WHERE i.is_active = true{where_extra}
           ORDER BY kv.value DESC NULLS LAST""",
        (kpi, kpi, *([codes] if codes else [])),
    )
    kdef = fetch_one("SELECT name, unit FROM kpi_definitions WHERE slug = %s", (kpi,))

    data = []
    for r in rows:
        v = float(r["value"] or 0)
        a = float(r["avg"] or 0)
        data.append(
            {
                "institutionId": str(r["id"]),
                "name": r["code"],
                "code": r["code"],
                "value": round(v, 2),
                "average": round(a, 2),
                "difference": round(v - a, 2),
            }
        )

    if data:
        top = max(data, key=lambda d: d["value"])
        summary = f"{top['name']} est en tête avec {top['value']}{(kdef or {}).get('unit', '%')}, soit {top['difference']:+.1f} par rapport à la moyenne."
    else:
        summary = "Aucune donnée disponible."

    return {
        "kpi": kpi,
        "kpiLabel": (kdef or {}).get("name", kpi),
        "unit": (kdef or {}).get("unit", "%"),
        "data": data,
        "summary": summary,
    }


@router.get("/services")
async def services_list(rbac: RBAC = Depends(get_current_user)):
    rows = fetch_all(
        """SELECT r.slug, r.label, r.accent_color, r.route_prefix,
                  (SELECT COUNT(*) FROM users u WHERE u.role_id = r.id) AS member_count
           FROM roles r WHERE r.level = 2 ORDER BY r.label"""
    )
    return {
        "data": [
            {
                "slug": r["slug"],
                "label": r["label"],
                "memberCount": int(r["member_count"]),
                "director": "—",
                "accentColor": r["accent_color"],
                "routePrefix": r["route_prefix"],
            }
            for r in rows
        ]
    }


@router.get("/reports")
async def reports(rbac: RBAC = Depends(get_current_user)):
    return {
        "templates": [
            {"name": "Rapport de Performance Global", "type": "PDF", "lastGenerated": "24 Avr 2025", "color": "#1E3A5F"},
            {"name": "Rapport GreenMetric", "type": "PDF", "lastGenerated": "20 Avr 2025", "color": "#16A34A"},
            {"name": "Rapport Recherche", "type": "PDF", "lastGenerated": "18 Avr 2025", "color": "#7C3AED"},
            {"name": "Rapport Financier", "type": "Excel", "lastGenerated": "15 Avr 2025", "color": "#059669"},
            {"name": "Rapport ISO Conformité", "type": "PDF", "lastGenerated": "10 Avr 2025", "color": "#F59E0B"},
        ],
        "scheduled": [
            {"name": "Rapport Mensuel", "frequency": "Mensuel", "nextRun": "01 Mai 2025", "format": "PDF"},
            {"name": "Rapport Trimestriel", "frequency": "Trimestriel", "nextRun": "01 Juil 2025", "format": "PDF"},
            {"name": "Rapport Annuel", "frequency": "Annuel", "nextRun": "01 Jan 2026", "format": "PDF"},
        ],
    }
