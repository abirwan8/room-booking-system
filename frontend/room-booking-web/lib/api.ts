const API_URL = "http://localhost:5055/api/v1";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server returned invalid JSON: ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function approveBooking(id: number) {
    return apiFetch(`/bookings/${id}/approve`, {
        method: "PUT",
    });
}

export async function rejectBooking(id: number) {
    return apiFetch(`/bookings/${id}/reject`, {
        method: "PUT",
    });
}