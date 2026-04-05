const BASE_URL = "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);
  return response.json();
};

export const fetchWithAuth = async (
  url,
  token,
  logout,
  options = {}
) => {
  const response = await fetch(`http://127.0.0.1:8000/api${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body || null,
  });

  if (response.status === 401) {
    logout();
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
};