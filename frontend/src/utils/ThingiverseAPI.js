// frontend/src/utils/ThingiverseAPI.js
const API_BASE = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:3001 (dev) / https://api.yourdomain.com (prod)

// Search models via your backend proxy
export async function searchModels(query, page = 1) {
  const url = `${API_BASE}/api/thingiverse/search?q=${encodeURIComponent(
    query
  )}&type=things&page=${page}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch search results (${res.status})`);
  return res.json();
}

// Single model details via your backend proxy
export async function getModelDetails(thingId) {
  const url = `${API_BASE}/api/thingiverse/things/${thingId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch model details (${res.status})`);
  return res.json();
}
