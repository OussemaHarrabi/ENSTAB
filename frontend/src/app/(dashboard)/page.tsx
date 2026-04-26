"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store"
import type { RoleSlug } from "@/lib/types"
import { ROLE_ROUTE_PREFIX } from "@/lib/types"

export default function DashboardRedirect() {
  const { currentRole, isAuthenticated } = useStore()

  useEffect(() => {
    if (!isAuthenticated || !currentRole) {
      redirect('/login')
    }
    const target = ROLE_ROUTE_PREFIX[currentRole] || '/president'
    redirect(target)
  }, [currentRole, isAuthenticated])

  return null
}
