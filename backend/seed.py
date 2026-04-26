"""UCAR comprehensive seed script — populates ALL demo data."""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db.supabase import fetch_one, execute, fetch_all
from auth.password import hash_password


def seed():
    print("🌱 Seeding UCAR Intelligence Platform data...")

    # Institutions (UCAR-only from the 12 component institutions)
    institutions = [
        ("ENI Carthage", "ENICarthage", "ecole", "Carthage", 2002, 3200, 280, True),
        ("Institut National des Sciences Appliquées", "INSAT", "institut", "Tunis", 1992, 4500, 380, True),
        ("École Polytechnique de Tunisie", "EPT", "ecole", "La Marsa", 1991, 2800, 250, True),
        ("Sup'Com", "SUPCOM", "ecole", "Ariana", 1998, 3500, 290, True),
        ("IHEC Carthage", "IHEC", "institut", "Carthage", 1985, 4200, 320, True),
        ("École Nationale d'Architecture", "ENAU", "ecole", "Sidi Bou Said", 1995, 1800, 150, True),
        ("Faculté des Sciences de Bizerte", "FSB", "faculte", "Bizerte", 1992, 3500, 260, True),
        ("Faculté des Sciences Économiques", "FSEGN", "faculte", "Nabeul", 2004, 2800, 200, True),
        ("ESSAI", "ESSAI", "ecole", "Tunis", 2005, 1500, 140, True),
        ("ISLT", "ISLT", "institut", "Tunis", 2000, 2200, 180, True),
        ("IPEST", "IPEST", "institut", "La Marsa", 1998, 2500, 170, True),
        ("ISSHT", "ISSHT", "institut", "Sousse", 2001, 1900, 150, True),
    ]

    for inst in institutions:
        execute("""
            INSERT INTO institutions (name, code, type, city, established_year, total_students, total_staff, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (code) DO NOTHING
        """, inst)

    print(f"  ✅ {len(institutions)} institutions seeded")

    # KPI Definitions
    kpis = [
        ("success_rate", "Taux de Réussite", "academic", "%", 85, 1.0),
        ("budget_execution", "Exécution Budgétaire", "finance", "%", 90, 1.0),
        ("employability_rate", "Taux d'Emploi", "employment", "%", 80, 1.0),
        ("green_score", "Score GreenMetric", "esg", "%", 75, 1.0),
        ("publications_count", "Publications", "research", "", 400, 1.0),
        ("staff_stability", "Stabilité Personnel", "hr", "%", 85, 1.0),
        ("enrollment", "Inscriptions", "academic", "", 25000, 1.0),
        ("dropout_rate", "Taux d'Abandon", "academic", "%", 10, 1.0),
        ("budget_per_student", "Budget par Étudiant", "finance", "DT", 5000, 1.0),
        ("research_funding", "Financement Recherche", "research", "MDT", 15, 1.0),
    ]

    for k in kpis:
        execute("INSERT INTO kpi_definitions (slug, name, category, unit, target_default, weight) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT (slug) DO NOTHING", k)

    print(f"  ✅ {len(kpis)} KPI definitions seeded")

    # KPI Values (for each institution)
    import random
    random.seed(42)
    inst_rows = fetch_all("SELECT id, code FROM institutions WHERE is_active = true")
    for inst in inst_rows:
        for k in kpis:
            base_target = k[4]
            val = random.uniform(base_target * 0.65, base_target * 1.1)
            execute("""
                INSERT INTO kpi_values (institution_id, kpi_slug, value, target, period)
                VALUES (%s, %s, %s, %s, '2024-2025') ON CONFLICT DO NOTHING
            """, (inst["id"], k[0], round(val, 1), base_target))

    print(f"  ✅ KPI values seeded for {len(inst_rows)} institutions")

    # GreenMetric entries (for 3 years)
    for inst in inst_rows:
        for year in [2023, 2024, 2025]:
            total = random.randint(4500, 7500)
            execute("""
                INSERT INTO greenmetric_entries (institution_id, year, total_score, max_score,
                    setting_infrastructure_score, setting_infrastructure_max,
                    energy_climate_score, energy_climate_max,
                    waste_score, waste_max, water_score, water_max,
                    transportation_score, transportation_max,
                    education_score, education_max,
                    governance_score, governance_max)
                VALUES (%s, %s, %s, 10000, %s, 1500, %s, 2100, %s, 1800, %s, 1000, %s, 1800, %s, 1400, %s, 900)
                ON CONFLICT (institution_id, year) DO UPDATE SET total_score = EXCLUDED.total_score
            """, (inst["id"], year, total,
                  random.randint(400, 1200), random.randint(800, 1800),
                  random.randint(600, 1500), random.randint(300, 800),
                  random.randint(400, 1400), random.randint(600, 1200), random.randint(300, 800)))

    print(f"  ✅ GreenMetric entries seeded")

    # Rankings
    ranking_systems = ["THE World University Rankings", "QS World University Rankings", "UI GreenMetric", "THE Impact Rankings"]
    for inst in inst_rows:
        for rs in ranking_systems:
            for year in [2023, 2024, 2025]:
                rank = random.randint(200, 1500) if rs != "UI GreenMetric" else random.randint(80, 350)
                execute("""
                    INSERT INTO rankings (institution_id, ranking_system, rank, year, score)
                    VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING
                """, (inst["id"], rs, f"#{rank}", year, round(random.uniform(20, 80), 1)))

    print(f"  ✅ Rankings seeded")

    # Research projects
    for i, inst in enumerate(inst_rows):
        for _ in range(2 + (i % 3)):
            execute("""
                INSERT INTO research_projects (title, institution_id, lead_researcher, funding_amount, funding_source, status, start_date, end_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                random.choice(["Smart Cities", "AI in Education", "Renewable Energy", "Water Management", "Digital Twin"]),
                inst["id"],
                f"Pr. {random.choice(['Ali', 'Sana', 'Mohamed', 'Leila', 'Karim'])} {random.choice(['Ben Ali', 'Mejri', 'Jarraya', 'Trabelsi'])}",
                random.randint(100000, 800000),
                random.choice(["PRF", "Européen", "National", "International"]),
                "En cours",
                "2024-01-01", "2026-12-31",
            ))

    print(f"  ✅ Research projects seeded")

    # Offre calls
    services = ["svc_informatique", "svc_equipement", "svc_bibliotheque", "svc_budget", "svc_rh"]
    titles = ["Fourniture équipements", "Maintenance bâtiments", "Abonnements numériques", "Formation personnel", "Acquisition mobilier"]
    for i, (s, t) in enumerate(zip(services, titles)):
        execute("""
            INSERT INTO offre_calls (title, service_id, budget_estimated, ai_probability, deadline, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (t, s, random.randint(100000, 800000), random.randint(60, 95),
              f"2025-{random.randint(5,12):02d}-{random.randint(1,28):02d}",
              random.choice(["predicted", "drafted", "published", "evaluation"])))

    print(f"  ✅ Offre calls seeded")

    # User accounts with real names
    users_to_seed = [
        ("president@ucar.tn", "ucar2024", "Nadia", "Mzoughi Aguir", "president", "presidence", "Présidence"),
        ("wahida.boutabba@ucar.tn", "ucar2024", "Wahida", "Boutabba", "svc_secretaire", "secretariat", "Secrétariat Général"),
        ("mohamed.khedimallah@ucar.tn", "ucar2024", "Mohamed", "Khedimallah", "svc_rh", "svc_rh", "Service RH"),
        ("samar.benyounes@ucar.tn", "ucar2024", "Samar", "Ben Younes", "svc_enseignement", "svc_enseignement", "Service Enseignement"),
        ("ridha.makadmi@ucar.tn", "ucar2024", "Ridha", "Makadmi", "svc_bibliotheque", "svc_bibliotheque", "Service Bibliothèque"),
        ("samir.ghodhbani@ucar.tn", "ucar2024", "Samir", "Ghodhbani", "svc_finances", "svc_finances", "Service Finances"),
        ("neffisa.razouk@ucar.tn", "ucar2024", "Neffisa", "Razouk", "svc_equipement", "svc_equipement", "Service Équipement"),
        ("iness.hmissi@ucar.tn", "ucar2024", "Iness", "Hmissi", "svc_informatique", "svc_informatique", "Service Informatique"),
        ("abdelkader.dehliz@ucar.tn", "ucar2024", "Abdelkader", "Dehliz", "svc_budget", "svc_budget", "Service Budget"),
        ("rawia.elwafi@ucar.tn", "ucar2024", "Rawia", "Elwafi", "svc_juridique", "svc_juridique", "Service Juridique"),
        ("hatem.khaloui@ucar.tn", "ucar2024", "Hatem", "Khaloui", "svc_academique", "svc_academique", "Service Académique"),
        ("mehrez.hammami@ucar.tn", "ucar2024", "Mehrez", "Hammami", "svc_recherche", "svc_recherche", "Service Recherche"),
    ]

    for u in users_to_seed:
        role = fetch_one("SELECT id FROM roles WHERE slug = %s", (u[3],))
        role_id = role["id"] if role else None
        execute("""
            INSERT INTO users (email, encrypted_password, first_name, last_name, role_id, service_id, service_name, can_access_all, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO UPDATE SET is_active = true
        """, (u[0], hash_password(u[1]), u[2], u[3], role_id, u[5], u[6], True, True))

    print(f"  ✅ {len(users_to_seed)} users seeded")

    # Seed president as can_access_all
    execute("UPDATE users SET can_access_all = true WHERE email = 'president@ucar.tn'")

    # Create anonymous user for student/teacher demo
    # (they're already in the seed data above)

    print("\n✅ Seeding complete!")
    return True


if __name__ == "__main__":
    seed()
