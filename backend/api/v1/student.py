"""Student portal endpoints."""
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import fetch_all, fetch_one, execute

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/dashboard")
async def dashboard(rbac: RBAC = Depends(get_current_user)):
    return {"profile":{"id":rbac.user_id,"firstName":"Oussema","lastName":"Harrabi","studentId":"ET-001","program":"INF-401","institution":"ENICarthage","semester":6,"currentSemester":6,"totalSemesters":6},"kpIs":{"currentAvg":14.2,"cumulativeGpa":14.8,"attendanceRate":85,"progress":78,"carbonFootprintTonnes":2.4,"carbonAvgTonnes":3.1,"validatedCredits":19,"totalCredits":19}}

@router.get("/grades")
async def grades(semester: int = None, rbac: RBAC = Depends(get_current_user)):
    return {"courses":[{"courseName":"INF-401 Algorithmique","credits":6,"ds":14,"tp":16,"exam":12,"finalGrade":13.5},{"courseName":"INF-302 Base de Données","credits":6,"ds":15,"tp":14,"exam":13,"finalGrade":14.0},{"courseName":"INF-403 Réseaux","credits":4,"ds":12,"tp":13,"exam":11,"finalGrade":12.0},{"courseName":"MGT-101 Gestion","credits":3,"ds":16,"tp":15,"exam":17,"finalGrade":16.0}],"semesterAvg":14.2,"cumulativeGpa":14.8,"trend":[{"semester":"S1","avg":12.5,"validatedCredits":30},{"semester":"S2","avg":13.2,"validatedCredits":30},{"semester":"S3","avg":13.8,"validatedCredits":30},{"semester":"S4","avg":14.1,"validatedCredits":30},{"semester":"S5","avg":14.5,"validatedCredits":30},{"semester":"S6","avg":14.2,"validatedCredits":19}]}

@router.get("/attendance")
async def attendance(rbac: RBAC = Depends(get_current_user)):
    return {"overall":85,"byCourse":[{"courseName":"INF-401","present":22,"total":24,"percentage":92},{"courseName":"INF-302","present":18,"total":20,"percentage":90},{"courseName":"INF-403","present":15,"total":18,"percentage":83},{"courseName":"MGT-101","present":10,"total":14,"percentage":71}]}

@router.get("/schedule")
async def schedule(semester: int = None, rbac: RBAC = Depends(get_current_user)):
    return {"week":[{"day":"Lundi","sessions":[{"start":"08:00","end":"10:00","course":"INF-401","room":"Salle 204"},{"start":"10:15","end":"12:15","course":"INF-302","room":"Labo 105"}]},{"day":"Mardi","sessions":[{"start":"08:00","end":"10:00","course":"INF-403","room":"Salle 301"},{"start":"14:00","end":"16:00","course":"MGT-101","room":"Amphi B"}]},{"day":"Mercredi","sessions":[{"start":"08:00","end":"12:00","course":"TP INF-401","room":"Labo 105"}]},{"day":"Jeudi","sessions":[{"start":"10:15","end":"12:15","course":"INF-302","room":"Salle 204"}]},{"day":"Vendredi","sessions":[{"start":"08:00","end":"10:00","course":"INF-403","room":"Salle 301"}]}]}

@router.get("/feedback")
async def feedback(rbac: RBAC = Depends(get_current_user)):
    return {"available":[{"course":"INF-401","canRate":True,"lastRated":None},{"course":"INF-302","canRate":True,"lastRated":None}],"submitted":[{"type":"equipment","description":"Projecteur défaillant Salle 204","status":"En cours","date":"20 Avr 2025"}]}

@router.post("/feedback")
async def submit_feedback(data: dict, rbac: RBAC = Depends(get_current_user)):
    execute("INSERT INTO feedback (user_id, type, description) VALUES (%s, %s, %s)",
            (rbac.user_id, data.get("type","feedback"), data.get("description","")))
    return {"success":True}

@router.get("/carbon")
async def carbon(rbac: RBAC = Depends(get_current_user)):
    return {"totalTonnes":2.4,"averageTonnes":3.1,"breakdown":{"transport":{"tonnes":1.2,"percentage":50},"waste":{"tonnes":0.6,"percentage":25},"water":{"tonnes":0.3,"percentage":12.5},"electricity":{"tonnes":0.3,"percentage":12.5}},"challenges":[{"name":"Utiliser les transports en commun","progress":80,"points":150},{"name":"Réduire les déchets plastique","progress":45,"points":100}]}

@router.get("/career")
async def career(rbac: RBAC = Depends(get_current_user)):
    return {"listings":[{"title":"Stage Data Scientist","company":"Vermeg","location":"Tunis","type":"stage","date":"20 Avr 2025"},{"title":"Développeur Full-Stack","company":"InstaDeep","location":"Tunis","type":"cdi","date":"18 Avr 2025"},{"title":"Ingénieur Réseaux","company":"Orange Tunisie","location":"Tunis","type":"stage","date":"15 Avr 2025"}],"internship":{"company":"Vermeg","supervisor":"M. Ali","status":"En cours"},"alumniStats":{"employed3Months":62,"employed6Months":78,"avgSalary":1800,"totalAlumni":12000,"topSectors":[{"sector":"Technologies","percentage":35},{"sector":"Finance","percentage":22}]}}

@router.get("/mobility")
async def mobility(rbac: RBAC = Depends(get_current_user)):
    return {"programs":[{"program":"Erasmus+ France","university":"Université Paris-Saclay","country":"France","places":5,"deadline":"30 Mai 2025","requirements":["Dossier académique","Test de langue","Lettre de motivation"]},{"program":"Erasmus+ Allemagne","university":"TU Berlin","country":"Allemagne","places":3,"deadline":"15 Juin 2025"}],"application":{"status":"En cours","progress":66,"checklist":[{"label":"Dossier académique","status":"done"},{"label":"Test de langue","status":"done"},{"label":"Lettre de motivation","status":"pending"}]}}

@router.get("/survey")
async def survey(rbac: RBAC = Depends(get_current_user)):
    return {"surveys":[{"title":"Satisfaction enseignants","deadline":"15 Mai 2025","status":"Non répondu"},{"title":"Employabilité","status":"Complété"},{"title":"Vie Étudiante","deadline":"30 Mai 2025","status":"Non répondu"}]}

@router.post("/survey")
async def submit_survey(data: dict, rbac: RBAC = Depends(get_current_user)):
    return {"success":True}

@router.get("/campus-life")
async def campus_life(rbac: RBAC = Depends(get_current_user)):
    return {"clubs":[{"name":"Club Robotique","members":45,"category":"Scientifique","status":"Actif"},{"name":"Croissant Rouge","members":120,"category":"Social","status":"Actif"},{"name":"Club Théâtre","members":35,"category":"Culturel","status":"Actif"},{"name":"Club Sport","members":200,"category":"Sportif","status":"Actif"},{"name":"Green Club","members":65,"category":"Environnement","status":"Actif"}],"events":[{"title":"Hackathon ENSTAB","date":"15 Mai 2025","location":"Amphi A","type":"Compétition"},{"title":"Journée Carrrière","date":"22 Mai 2025","location":"Hall Central","type":"Carrière"},{"title":"Conférence IA","date":"05 Juin 2025","location":"Amphi B","type":"Conférence"}]}
