const API_BASE = "http://localhost:5000/api";

/* =========================
   AUTH
========================= */

export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* =========================
   POSTS
========================= */

export const getPosts = async (token) => {
  const res = await fetch(`${API_BASE}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const createPost = async (token, data) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const sendInterest = async (token, postId) => {
  const res = await fetch(`${API_BASE}/posts/${postId}/interest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

/* =========================
   STARTUP
========================= */

export const getMyStartupPosts = async (token) => {
  const res = await fetch(`${API_BASE}/posts/mystartup/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

/* =========================
   PROFILE
========================= */

export const getMyProfile = async (token) => {
  const res = await fetch(`${API_BASE}/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const updateMyProfile = async (token, profileData) => {
  const res = await fetch(`${API_BASE}/profile/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return res.json();
};
export const getNotifications = async (token) => {
  const res = await fetch("http://localhost:5000/api/posts/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
