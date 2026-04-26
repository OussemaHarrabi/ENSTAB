"""Teacher portal endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one, execute

router = APIRouter(prefix="/teacher", tags=["teacher"])

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"profile":{"id":rbac.user_id,"firstName":"Ahmed","lastName":"Ben Ali","email":"ahmed.benali@ensi.tn","title":"Dr.","institution":"ENICarthage","department":"Informatique"},"kpIs":{"totalCourses":4,"totalStudents":185,"successRate":83,"hoursCompleted":42,"hoursPlanned":48,"overtime":4},"courses":[{"id":"crs-001","name":"Algorithmique Avancée","code":"INF-401","students":48,"progress":85,"avgGrade":14.2,"sessionsTotal":24,"sessionsCompleted":20},{"id":"crs-002","name":"Base de Données","code":"INF-302","students":52,"progress":75,"avgGrade":13.5,"sessionsTotal":20,"sessionsCompleted":15}],"upcoming":[{"type":"Examen","date":"28 Avr 2025","course":"INF-401"},{"type":"TP","date":"30 Avr 2025","course":"INF-302"}]}

@router.get("/courses")
async def courses(rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"id":"crs-001","name":"Algorithmique Avancée","code":"INF-401","students":48,"progress":85,"avgGrade":14.2,"sessionsTotal":24,"sessionsCompleted":20},{"id":"crs-002","name":"Base de Données","code":"INF-302","students":52,"progress":75,"avgGrade":13.5,"sessionsTotal":20,"sessionsCompleted":15}]}

@router.get("/attendance")
async def attendance(courseId: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"courses":[{"id":"crs-001","name":"INF-401","attendanceRate":85}],"sessions":[{"date":"26 Avr 2025","course":"INF-401","students":[{"name":"Ali Salem","status":"present"},{"name":"Sana Karray","status":"present"},{"name":"Karim Jlassi","status":"absent"}]}]}

@router.put("/attendance")
async def update_attendance(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True,"saved":len(data.get("students",[]))}

@router.get("/grades")
async def grades(courseId: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"students":[{"name":"Ali Salem","studentId":"ET-001","ds":14,"tp":16,"exam":12,"finalGrade":13.5,"attendanceRate":92},{"name":"Sana Karray","studentId":"ET-002","ds":16,"tp":15,"exam":14,"finalGrade":15.0,"attendanceRate":95},{"name":"Karim Jlassi","studentId":"ET-003","ds":10,"tp":12,"exam":8,"finalGrade":9.8,"attendanceRate":78}],"distribution":{"classAvg":13.9,"nationalAvg":13.5,"stdDev":2.8,"histogram":[{"range":"0-5","count":2},{"range":"5-10","count":8},{"range":"10-12","count":12},{"range":"12-15","count":18},{"range":"15-20","count":8}]}}

@router.put("/grades")
async def update_grades(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"saved":len(data.get("students",[])),"warnings":["La distribution s'écarte de la moyenne nationale de 15%"]}

@router.get("/research")
async def research(rbac: RBAC = Depends(get_current_user)):
    return {"publications":[{"title":"Deep Learning in NLP","journal":"IEEE Access","year":2025,"doi":"10.1000/xyz","isUcarAffiliated":True,"citations":12},{"title":"IoT pour l'Agriculture","journal":"Sensors","year":2024,"doi":"10.1000/abc","isUcarAffiliated":True,"citations":8}],"projects":[{"title":"AI for Education","role":"Co-PI","funding":"PRF","budget":250000}]}

@router.post("/research")
async def add_publication(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True,"id":"pub-new","title":data.get("title","")}

@router.get("/hours")
async def hours(rbac: RBAC = Depends(get_current_user)):
    return {"totalCompleted":42,"totalPlanned":48,"overtime":4,"weeks":[{"week":w,"month":"Avril 2025","completed":8.5+((w-1)*0.2),"planned":8} for w in range(1,6)]}

@router.get("/syllabus")
async def syllabus(courseId: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Chapitre 1: Introduction","progress":100,"status":"Terminé","order":1},{"name":"Chapitre 2: Structures","progress":85,"status":"En cours","order":2},{"name":"Chapitre 3: Algorithmes","progress":60,"status":"En cours","order":3},{"name":"Chapitre 4: Optimisation","progress":20,"status":"En cours","order":4}]}

@router.get("/analytics")
async def analytics(rbac: RBAC = Depends(get_current_user)):
    return {"overallAvg":13.9,"passRate":84,"atRiskCount":12,"attendanceRate":82,"coursePerformance":[{"name":"INF-401","avgGrade":14.2,"passRate":88},{"name":"INF-302","avgGrade":12.8,"passRate":75}]}

@router.get("/rooms")
async def rooms(institutionId: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"id":"r-001","number":"Salle 204","building":"Bâtiment A","capacity":48,"equipment":["Projecteur","Tableau"],"type":"classroom","status":"Disponible"},{"id":"r-002","number":"Labo 105","building":"Bâtiment B","capacity":24,"equipment":["PCs","Projecteur"],"type":"lab","status":"Disponible"}]}

@router.post("/incidents")
async def report_incident(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True,"id":"inc-new"}
