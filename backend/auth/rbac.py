"""Role-based access control helpers."""
from typing import Any


class RBAC:
    """Wraps a JWT payload with permission helpers."""

    def __init__(self, claims: dict[str, Any]):
        self.user_id = claims.get("sub")
        self.email = claims.get("email")
        self.role = claims.get("role")
        self.role_label = claims.get("role_label")
        self.level = claims.get("level", 99)
        self.service_id = claims.get("service_id")
        self.service_name = claims.get("service_name")
        self.institution_ids: list[str] = claims.get("institution_ids", []) or []
        self.can_access_all = claims.get("can_access_all", False)

    @property
    def is_president(self) -> bool:
        return self.role == "president" or self.level == 0

    @property
    def is_service_head(self) -> bool:
        return self.role and self.role.startswith("svc_")

    @property
    def is_teacher(self) -> bool:
        return self.role == "teacher"

    @property
    def is_student(self) -> bool:
        return self.role == "student"

    def can_access_institution(self, institution_id: str | None) -> bool:
        if self.can_access_all or self.is_president:
            return True
        if institution_id is None:
            return False
        return institution_id in self.institution_ids

    def can_assign_role(self, target_level: int) -> bool:
        return self.level < target_level

    def can_manage_users(self) -> bool:
        return self.level <= 2
