"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function DashboardRedirect() {
  const { currentRole } = useStore()
  const roleRoutes: Record<string, string> = {
    hq_super_admin: '/hq', hq_dept_head: '/hq-domain/academic', hq_staff: '/hq-staff/academic',
    inst_admin: '/institution', inst_dept_head: '/inst-dept/academic', inst_staff: '/inst-staff/academic',
    teacher: '/teacher', student: '/student',
  }
  useEffect(() => { redirect(roleRoutes[currentRole] || '/hq') }, [currentRole])
  return null
}
