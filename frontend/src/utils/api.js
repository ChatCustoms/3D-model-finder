// frontend/src/utils/api.js

// Prefer the Vite env var. Fall back to sensible defaults for dev/prod.
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://api-3d-model-finder.duckdns.org");

// Helper to keep response handling consistent
function checkResponse(res) {
  if (!res.ok) return Promise.reject(`Error: ${res.status}`);
  return res.json();
}

// --- Items endpoints (only if your backend implements them under /api/items) ---

export function getItems(token) {
  return fetch(`${API_BASE}/api/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // If you ever switch to cookie auth, uncomment:
    // credentials: "include",
  }).then(checkResponse);
}

export function deleteItem(id, token) {
  return fetch(`${API_BASE}/api/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // credentials: "include",
  }).then(checkResponse);
}

export function addItem(item, token) {
  return fetch(`${API_BASE}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // credentials: "include",
    body: JSON.stringify(item),
  }).then(checkResponse);
}

export const addCardLike = (id, token) => {
  return fetch(`${API_BASE}/api/items/${id}/likes`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    // credentials: "include",
  }).then(checkResponse);
};

export const removeCardLike = (id, token) => {
  return fetch(`${API_BASE}/api/items/${id}/likes`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    // credentials: "include",
  }).then(checkResponse);
};

// --- Profile ---

export function updateProfile(data, token) {
  return fetch(`${API_BASE}/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // credentials: "include",
    body: JSON.stringify(data),
  }).then(checkResponse);
}

// Optional: export the base if other modules need it
export { API_BASE, checkResponse };
