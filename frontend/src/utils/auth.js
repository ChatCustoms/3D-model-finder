const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = ({ name, avatar, email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
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

export const login = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => Promise.reject(data));
    }
    return res.json();
  });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => Promise.reject(data));
    }
    return res.json();
  });
};

export default { register, login, checkToken };
