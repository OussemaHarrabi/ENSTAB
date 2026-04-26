/**
 * Frontend → Backend API connection layer.
 * Replace mock data imports with these fetchers for real backend integration.
 */

import { useStore } from './store'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('ucar_session')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.currentUser?.token || null
    }
  } catch {}
  return null
}

export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    // Clear session and redirect to login
    localStorage.removeItem('ucar_session')
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError(401, 'Session expirée')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new ApiError(res.status, error?.error?.message || 'Erreur serveur')
  }

  return res.json()
}

// ─── AUTH ───
export const auth = {
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string; refresh_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  verify2FA: (tempToken: string, code: string) =>
    fetchApi('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ temp_token: tempToken, code }),
    }),
  me: () => fetchApi('/auth/me'),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  refresh: (refreshToken: string) =>
    fetchApi('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
}

// ─── PRÉSIDENCE ───
export const president = {
  dashboard: () => fetchApi('/president/dashboard'),
  greenMetric: () => fetchApi('/president/greenmetric'),
  rankings: () => fetchApi('/president/rankings'),
  compliance: () => fetchApi('/president/compliance'),
  recherche: () => fetchApi('/president/recherche'),
  anomalies: (params?: string) => fetchApi(`/president/anomalies${params ? `?${params}` : ''}`),
  updateAnomaly: (id: string, data: any) =>
    fetchApi(`/president/anomalies/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  appelsOffres: () => fetchApi('/president/appels-offres'),
  institutions: (params?: string) => fetchApi(`/president/institutions${params ? `?${params}` : ''}`),
  institutionDetail: (id: string) => fetchApi(`/president/institutions/${id}`),
  comparisons: (params: string) => fetchApi(`/president/comparaisons?${params}`),
  services: () => fetchApi('/president/services'),
  reports: () => fetchApi('/president/reports'),
}

// ─── INSTITUTIONS ───
export const institutions = {
  list: (params?: string) => fetchApi(`/institutions${params ? `?${params}` : ''}`),
  detail: (id: string) => fetchApi(`/institutions/${id}`),
  kpis: (id: string, params?: string) => fetchApi(`/institutions/${id}/kpis${params ? `?${params}` : ''}`),
  domainKpis: (id: string) => fetchApi(`/institutions/${id}/domain-kpis`),
  greenMetric: (id: string, year?: number) => fetchApi(`/institutions/${id}/greenmetric${year ? `?year=${year}` : ''}`),
  rankings: (id: string) => fetchApi(`/institutions/${id}/rankings`),
}

// ─── ANALYTICS ───
export const analytics = {
  aggregate: (params?: string) => fetchApi(`/analytics/aggregate${params ? `?${params}` : ''}`),
  enrollmentTrend: (params?: string) => fetchApi(`/analytics/enrollment-trend${params ? `?${params}` : ''}`),
  forecast: (params: string) => fetchApi(`/analytics/forecast?${params}`),
  benchmarks: () => fetchApi('/benchmarks/national-averages'),
  compare: (params: string) => fetchApi(`/benchmarks/compare?${params}`),
}

// ─── SERVICE PLATFORMS ───
function serviceApi(slug: string) {
  return {
    dashboard: () => fetchApi(`/svc/${slug}/dashboard`),
    get: (endpoint: string) => fetchApi(`/svc/${slug}/${endpoint}`),
  }
}

export const services = {
  rh: serviceApi('rh'),
  enseignement: serviceApi('enseignement'),
  finances: serviceApi('finances'),
  budget: serviceApi('budget'),
  informatique: serviceApi('informatique'),
  equipement: serviceApi('equipement'),
  bibliotheque: serviceApi('bibliotheque'),
  juridique: serviceApi('juridique'),
  academique: serviceApi('academique'),
  recherche: serviceApi('recherche'),
  sg: serviceApi('sg'),
}

// ─── TEACHER ───
export const teacher = {
  dashboard: () => fetchApi('/teacher/dashboard'),
  courses: () => fetchApi('/teacher/courses'),
  attendance: (courseId?: string) => fetchApi(`/teacher/attendance${courseId ? `?courseId=${courseId}` : ''}`),
  updateAttendance: (data: any) => fetchApi('/teacher/attendance', { method: 'PUT', body: JSON.stringify(data) }),
  grades: (courseId?: string) => fetchApi(`/teacher/grades${courseId ? `?courseId=${courseId}` : ''}`),
  updateGrades: (data: any) => fetchApi('/teacher/grades', { method: 'PUT', body: JSON.stringify(data) }),
  research: () => fetchApi('/teacher/research'),
  addPublication: (data: any) => fetchApi('/teacher/research', { method: 'POST', body: JSON.stringify(data) }),
  hours: () => fetchApi('/teacher/hours'),
  syllabus: (courseId?: string) => fetchApi(`/teacher/syllabus${courseId ? `?courseId=${courseId}` : ''}`),
  analytics: () => fetchApi('/teacher/analytics'),
  rooms: (institutionId?: string) => fetchApi(`/teacher/rooms${institutionId ? `?institutionId=${institutionId}` : ''}`),
}

// ─── STUDENT ───
export const student = {
  dashboard: () => fetchApi('/student/dashboard'),
  grades: (semester?: number) => fetchApi(`/student/grades${semester ? `?semester=${semester}` : ''}`),
  attendance: () => fetchApi('/student/attendance'),
  schedule: (semester?: number) => fetchApi(`/student/schedule${semester ? `?semester=${semester}` : ''}`),
  feedback: () => fetchApi('/student/feedback'),
  submitFeedback: (data: any) => fetchApi('/student/feedback', { method: 'POST', body: JSON.stringify(data) }),
  carbon: () => fetchApi('/student/carbon'),
  career: () => fetchApi('/student/career'),
  mobility: () => fetchApi('/student/mobility'),
  survey: () => fetchApi('/student/survey'),
  submitSurvey: (data: any) => fetchApi('/student/survey', { method: 'POST', body: JSON.stringify(data) }),
  campusLife: () => fetchApi('/student/campus-life'),
}

// ─── AI CHAT ───
export const chat = {
  query: (message: string, context?: any) =>
    fetchApi<{ response: string; data?: any; chartType?: string; sources?: any[]; exportable: boolean }>('/chat/query', {
      method: 'POST',
      body: JSON.stringify({ message, context: context || {} }),
    }),
}

// ─── USERS ───
export const users = {
  list: (params?: string) => fetchApi(`/users${params ? `?${params}` : ''}`),
  assign: (data: any) => fetchApi('/users/assign', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivate: (id: string) => fetchApi(`/users/${id}`, { method: 'DELETE' }),
}

// ─── DOCUMENTS ───
export const documents = {
  ingest: async (file: File, institutionId?: string, domain?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (institutionId) formData.append('institutionId', institutionId)
    if (domain) formData.append('domain', domain)

    const token = getToken()
    const res = await fetch(`${API_BASE}/documents/ingest`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    return res.json()
  },
  status: (docId: string) => fetchApi(`/documents/${docId}/status`),
}

// ─── ROOMS & INCIDENTS ───
export const rooms = {
  list: (params?: string) => fetchApi(`/rooms${params ? `?${params}` : ''}`),
  reserve: (data: any) => fetchApi('/rooms/reserve', { method: 'POST', body: JSON.stringify(data) }),
}

export const incidents = {
  list: (params?: string) => fetchApi(`/incidents${params ? `?${params}` : ''}`),
  report: (data: any) => fetchApi('/incidents', { method: 'POST', body: JSON.stringify(data) }),
}

// ─── SETTINGS ───
export const settings = {
  get: () => fetchApi('/settings'),
  update: (data: any) => fetchApi('/settings', { method: 'PUT', body: JSON.stringify(data) }),
}
