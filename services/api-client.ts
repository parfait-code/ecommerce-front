const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nat-logos-adsl-neil.trycloudflare.com";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data?.error?.message || "Une erreur est survenue");
  }

  return data.data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { token }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: "POST", body, token }),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: "PATCH", body, token }),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: "PUT", body, token }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: "DELETE", token }),
};