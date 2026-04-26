"""Service Recherche & Coopération endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all

router = APIRouter(prefix="/svc/recherche", tags=["svc_recherche"])
SERVICE = {"slug":"svc_recherche","label":"Service Recherche & Coopération","accentColor":"#9333EA"}

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"service":SERVICE,"kpIs":[{"label":"Publications","value":458,"unit":"","target":500},{"label":"Taux Affiliation","value":84.1,"unit":"%","target":90},{"label":"Projets Actifs","value":12,"unit":"","target":15},{"label":"Doctorants","value":380,"unit":"","target":400}],"trendChart":[{"month":m,"value":v} for m,v in zip(["Jan","Fév","Mar","Avr","Mai"],[320,355,390,420,458])],"distributionChart":[{"label":"FST","value":25},{"label":"ENIT","value":20},{"label":"ENICarthage","value":18},{"label":"INSAT","value":15},{"label":"Autres","value":22}]}

@router.get("/publications")
async def publications(annee: int = 2025, rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total2025":458,"affiliated":385,"international":175,"unaffiliated":73},"trend":[{"year":y,"total":t,"affiliated":a} for y,t,a in [(2021,320,210),(2022,355,250),(2023,390,290),(2024,420,335),(2025,458,385)]],"topInstitutions":[{"name":"FST","pubs":85,"aff":78,"rate":91.8},{"name":"ENIT","pubs":72,"aff":65,"rate":90.3},{"name":"ENICarthage","pubs":68,"aff":62,"rate":91.2},{"name":"INSAT","pubs":52,"aff":45,"rate":86.5}]}

@router.get("/projets")
async def projets(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":43,"active":12,"budget":"16.6M DT","externalFunding":68},"projects":[{"name":"Smart Agriculture IoT","leader":"Pr. Mohamed Salah","budget":450000,"funding":"PRF","status":"En cours"},{"name":"AI for Health","leader":"Dr. Amira Ben Salah","budget":380000,"funding":"Européen","status":"En cours"},{"name":"Renewable Energy","leader":"Pr. Sana Mejri","budget":520000,"funding":"PRF","status":"En cours"},{"name":"Blockchain Education","leader":"Dr. Karim Jarraya","budget":250000,"funding":"National","status":"Terminé"},{"name":"Water Resources","leader":"Dr. Leila Trabelsi","budget":600000,"funding":"International","status":"En cours"}],"byStatus":[{"status":"En cours","count":12},{"status":"Terminé","count":18},{"status":"Soumis","count":8}]}

@router.get("/cooperation")
async def cooperation(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"agreements":28,"active":25,"mobilitesPerYear":120,"countries":18},"agreements":[{"country":"France","partner":"Université Paris-Saclay","type":"Erasmus+","students":12,"since":"2018"},{"country":"Allemagne","partner":"TU Berlin","type":"Bilatéral","students":8,"since":"2019"},{"country":"Canada","partner":"Université Laval","type":"Cotutelle","students":5,"since":"2020"},{"country":"Italie","partner":"Université de Bologne","type":"Erasmus+","students":10,"since":"2017"},{"country":"Espagne","partner":"Université Complutense","type":"Erasmus+","students":7,"since":"2019"},{"country":"Japon","partner":"Université de Tokyo","type":"Bilatéral","students":0,"since":"2025","status":"Négociation"}]}

@router.get("/doctorants")
async def doctorants(rbac: RBAC = Depends(get_current_user)):
    return {"stats":{"total":380,"new2025":65,"defendedPerYear":42,"completionRate":72},"phds":[{"name":"Mohamed Ali","topic":"Machine Learning en Santé","director":"Pr. Salah","year":"3e","status":"En cours"},{"name":"Sana Karray","topic":"Énergie Solaire","director":"Pr. Mejri","year":"2e","status":"En cours"},{"name":"Karim Jlassi","topic":"Blockchain Éducation","director":"Dr. Ben Ali","year":"4e","status":"Soutenance"},{"name":"Amira Fekih","topic":"IoT Agricole","director":"Pr. Hammami","year":"1e","status":"En cours"}],"byYear":[{"year":"1ère","count":85},{"year":"2ème","count":72},{"year":"3ème","count":68},{"year":"4ème","count":55},{"year":"5e+","count":100}]}

@router.get("/classements")
async def classements(rbac: RBAC = Depends(get_current_user)):
    return {"rankings":[{"system":"THE 2025","rank":"#401","target":"#350","delta":"+100","color":"#2563EB"},{"system":"QS 2025","rank":"#551","target":"#450","delta":"+100","color":"#7C3AED"},{"system":"GreenMetric 2025","rank":"#120","target":"#100","delta":"+25","color":"#059669"}],"trend":[{"year":y,"the":t,"qs":q,"greenmetric":g} for y,t,q,g in [(2021,1201,1400,350),(2022,801,1001,220),(2023,601,801,180),(2024,501,651,145),(2025,401,551,120)]]}

@router.get("/comparaisons")
async def comparaisons(metric: str = "pubs", rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"FST","pubs":85,"aff":78,"phds":45,"projets":12},{"name":"ENIT","pubs":72,"aff":65,"phds":38,"projets":10},{"name":"ENICarthage","pubs":68,"aff":62,"phds":32,"projets":8},{"name":"INSAT","pubs":52,"aff":45,"phds":25,"projets":5}]}

@router.get("/rapports")
async def rapports(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Bilan Recherche Annuel","type":"PDF","date":"24 Avr 2025"},{"name":"Thèses Soutenues","type":"XLSX","date":"20 Avr 2025"},{"name":"Coopération Internationale","type":"PDF","date":"18 Avr 2025"},{"name":"Classements","type":"PDF","date":"15 Avr 2025"}]}
