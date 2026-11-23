import type { AuthUser, Role } from "@/lib/api";

export const DEMO_PASSWORD = "Password123!";

export type DemoAccount = {
  email: string;
  password: string;
  name: string;
  roles: Role[];
  label: string;
};

/** Hardcoded accounts for local demo sign-in. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@letwell.test",
    password: DEMO_PASSWORD,
    name: "Amelia Hart",
    roles: ["ADMIN"],
    label: "Admin",
  },
  {
    email: "manager.north@letwell.test",
    password: DEMO_PASSWORD,
    name: "Noah Whitfield",
    roles: ["MANAGER"],
    label: "Manager",
  },
  {
    email: "tenant.active@letwell.test",
    password: DEMO_PASSWORD,
    name: "James Okonkwo",
    roles: ["TENANT"],
    label: "Tenant",
  },
];

type StoredLocalUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  roles: Role[];
};

const SESSION_KEY = "letwell_session_user";
const LOCAL_USERS_KEY = "letwell_local_users";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readLocalUsers(): StoredLocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredLocalUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: StoredLocalUser[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function readSessionUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function writeSessionUser(user: AuthUser | null): void {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

function toAuthUser(input: {
  id: string;
  email: string;
  name: string;
  roles: Role[];
}): AuthUser {
  return {
    id: input.id,
    email: input.email,
    name: input.name,
    status: "APPROVED",
    roles: input.roles,
  };
}

export function authenticateDemo(
  email: string,
  password: string,
): AuthUser | null {
  const normalized = normalizeEmail(email);

  const hardcoded = DEMO_ACCOUNTS.find(
    (account) => account.email === normalized && account.password === password,
  );
  if (hardcoded) {
    return toAuthUser({
      id: `demo-${hardcoded.email}`,
      email: hardcoded.email,
      name: hardcoded.name,
      roles: hardcoded.roles,
    });
  }

  const local = readLocalUsers().find(
    (account) => account.email === normalized && account.password === password,
  );
  if (local) {
    return toAuthUser({
      id: local.id,
      email: local.email,
      name: local.name,
      roles: local.roles,
    });
  }

  return null;
}

export function registerLocalUser(input: {
  name: string;
  email: string;
  password: string;
  asTenant: boolean;
  asManager: boolean;
}): AuthUser {
  const email = normalizeEmail(input.email);
  const users = readLocalUsers();

  if (DEMO_ACCOUNTS.some((account) => account.email === email)) {
    throw new Error("That email is reserved for a demo account. Sign in instead.");
  }
  if (users.some((account) => account.email === email)) {
    throw new Error("An account with that email already exists. Sign in instead.");
  }

  const roles: Role[] = [];
  if (input.asTenant) roles.push("TENANT");
  if (input.asManager) roles.push("MANAGER");
  if (roles.length === 0) roles.push("TENANT");

  const created: StoredLocalUser = {
    id: `local-${Date.now()}`,
    email,
    password: input.password,
    name: input.name.trim(),
    roles,
  };
  writeLocalUsers([...users, created]);

  return toAuthUser({
    id: created.id,
    email: created.email,
    name: created.name,
    roles: created.roles,
  });
}
