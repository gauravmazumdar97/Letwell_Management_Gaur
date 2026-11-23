const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type Role = "TENANT" | "MANAGER" | "ADMIN";
export type AccountStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: AccountStatus;
  roles: Role[];
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getToken(): string | null {
  return localStorage.getItem("letwell_token");
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem("letwell_token", token);
  else localStorage.removeItem("letwell_token");
}

export function getActiveRole(): Role | null {
  return (localStorage.getItem("letwell_active_role") as Role | null) ?? null;
}

export function setActiveRole(role: Role | null): void {
  if (role) localStorage.setItem("letwell_active_role", role);
  else localStorage.removeItem("letwell_active_role");
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const activeRole = getActiveRole();
  if (activeRole) headers.set("X-Letwell-Role", activeRole);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? "Request failed", data?.details);
  }
  return data as T;
}
