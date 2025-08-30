const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const api = async (path, { method = "GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = "Request failed"
    try {
      const data = await res.json()
      msg = data.error || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}
