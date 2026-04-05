const BASE_URL = "http://127.0.0.1:8000/api";

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  throw new Error(
    `HTTP ${response.status}: ${text.slice(0, 200) || "Unexpected non-JSON response"}`
  );
};

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

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      throw new Error(payload.detail || JSON.stringify(payload));
    }

    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text.slice(0, 200) || "Unexpected non-JSON response"}`
    );
  }

  return parseResponse(response);
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
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      throw new Error(payload.detail || JSON.stringify(payload));
    }

    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text.slice(0, 200) || "Unexpected non-JSON response"}`
    );
  }

  return parseResponse(response);
};