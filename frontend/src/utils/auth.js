const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = ({ name, avatar, email, password }) => {
  return fetch(`${BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => Promise.reject(data));
    }
    return res.json();
  });
};

export const login = ({ email, password }) =>
  fetch(`${BASE_URL}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || `Login failed (${res.status})`);
    return data; // { token }
  });

export const checkToken = (token) =>
  fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || `Auth failed (${res.status})`);
    return data; // user object
  });

export default { register, login, checkToken };
