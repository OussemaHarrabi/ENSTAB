"""Aggregates all API routers into one."""
from fastapi import APIRouter

from api.v1.auth import router as auth_router
from api.v1.analytics import router as analytics_router
from api.v1.president import router as president_router
from api.v1.services_rh import router as services_rh_router
from api.v1.services_enseignement import router as services_enseignement_router
from api.v1.services_finances import router as services_finances_router
from api.v1.services_budget import router as services_budget_router
from api.v1.services_informatique import router as services_informatique_router
from api.v1.services_equipement import router as services_equipement_router
from api.v1.services_bibliotheque import router as services_bibliotheque_router
from api.v1.services_juridique import router as services_juridique_router
from api.v1.services_academique import router as services_academique_router
from api.v1.services_recherche import router as services_recherche_router
from api.v1.services_sg import router as services_sg_router
from api.v1.teacher import router as teacher_router
from api.v1.student import router as student_router
from api.v1.chat import router as chat_router
from api.v1.documents import router as documents_router
from api.v1.rooms import router as rooms_router
from api.v1.users import router as users_router
from api.v1.settings import router as settings_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(analytics_router)
api_router.include_router(president_router)
api_router.include_router(services_rh_router)
api_router.include_router(services_enseignement_router)
api_router.include_router(services_finances_router)
api_router.include_router(services_budget_router)
api_router.include_router(services_informatique_router)
api_router.include_router(services_equipement_router)
api_router.include_router(services_bibliotheque_router)
api_router.include_router(services_juridique_router)
api_router.include_router(services_academique_router)
api_router.include_router(services_recherche_router)
api_router.include_router(services_sg_router)
api_router.include_router(teacher_router)
api_router.include_router(student_router)
api_router.include_router(chat_router)
api_router.include_router(documents_router)
api_router.include_router(rooms_router)
api_router.include_router(users_router)
api_router.include_router(settings_router)
