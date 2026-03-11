// ── API helper ────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

function qs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const api = {
  // ── Admin ──────────────────────────────────────────────────────────────
  adminLogin:    (email, password) => request('POST', '/admin/login', { email, password }),
  getDashboard:  ()                => request('GET',  '/admin/dashboard'),
  exportEvent:   (event)           => request('GET',  `/admin/export${event ? `?event=${encodeURIComponent(event)}` : ''}`),

  // ── Events ─────────────────────────────────────────────────────────────
  getEvents:     (includeInactive = false) => request('GET', `/events${qs({ includeInactive })}`),
  createEvent:   (dto)                     => request('POST', '/events', dto),
  updateEvent:   (id, dto)                 => request('PATCH', `/events/${id}`, dto),
  deleteEvent:   (id)                      => request('DELETE', `/events/${id}`),

  // ── Participants ───────────────────────────────────────────────────────
  getParticipants: (page = 1, limit = 50) => request('GET', `/participants${qs({ page, limit })}`),
  deleteParticipant: (id)                 => request('DELETE', `/participants/${id}`),

  // ── Registrations ──────────────────────────────────────────────────────
  register:          (dto)                => request('POST', '/registrations', dto),
  getRegistrations:  (page = 1, limit = 50) => request('GET', `/registrations${qs({ page, limit })}`),
  updateRegistrationStatus: (id, status)  => request('PATCH', `/registrations/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => request('PATCH', `/registrations/${id}/payment`, { paymentStatus }),
  deleteRegistration: (id)                => request('DELETE', `/registrations/${id}`),
  getStats:          ()                   => request('GET',  '/registrations/stats'),
};
