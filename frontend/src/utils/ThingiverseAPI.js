const BASE_URL = 'https://api.thingiverse.com';
const APP_TOKEN = import.meta.env.VITE_THINGIVERSE_APP_TOKEN; // Store this in .env file

const headers = {
  Authorization: `Bearer ${APP_TOKEN}`,
};

export const searchModels = async (query) => {
  const res = await fetch(`${BASE_URL}/search/${query}?type=things`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
};

export const getModelDetails = async (thingId) => {
  const res = await fetch(`${BASE_URL}/things/${thingId}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch model details");
  }

  return res.json();
};