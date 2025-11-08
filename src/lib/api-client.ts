import { ApiResponse } from "../../shared/types"

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData

  const config: RequestInit = {
    ...init,
    headers: {
      // Let browser set Content-Type for FormData
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  }

  const res = await fetch(path, config)
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || 'Request failed')
  return json.data
}

api.get = <T>(path: string, init?: RequestInit) => {
  return api<T>(path, { ...init, method: 'GET' })
}

api.post = <T>(path: string, body: unknown, init?: RequestInit) => {
  const isFormData = body instanceof FormData
  return api<T>(path, {
    ...init,
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  })
}

api.put = <T>(path: string, body: unknown, init?: RequestInit) => {
  const isFormData = body instanceof FormData
  return api<T>(path, {
    ...init,
    method: 'PUT',
    body: isFormData ? body : JSON.stringify(body),
  })
}

api.delete = <T>(path: string, init?: RequestInit) => {
  return api<T>(path, { ...init, method: 'DELETE' })
}