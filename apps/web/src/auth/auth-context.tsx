import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  type Role,
  getActiveRole,
  setActiveRole,
  setToken,
} from "@/lib/api";
import {
  authenticateDemo,
  readSessionUser,
  registerLocalUser,
  writeSessionUser,
} from "@/auth/demo-credentials";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  asTenant: boolean;
  asManager: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  activeRole: Role | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
  selectRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applyRoleDefaults(user: AuthUser): Role | null {
  const stored = getActiveRole();
  if (stored && user.roles.includes(stored)) return stored;
  if (user.roles.length === 1) {
    setActiveRole(user.roles[0]);
    return user.roles[0];
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<Role | null>(getActiveRole());

  const refresh = useCallback(async () => {
    const session = readSessionUser();
    if (session) {
      setUser(session);
      setActiveRoleState(applyRoleDefaults(session));
      setToken(`local:${session.id}`);
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const matched = authenticateDemo(email, password);
    if (!matched) {
      throw new Error("Invalid email or password. Use a demo account or register first.");
    }
    writeSessionUser(matched);
    setToken(`local:${matched.id}`);
    setUser(matched);
    setActiveRoleState(applyRoleDefaults(matched));
    return matched;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const created = registerLocalUser(input);
    writeSessionUser(created);
    setToken(`local:${created.id}`);
    setUser(created);
    setActiveRoleState(applyRoleDefaults(created));
    return created;
  }, []);

  const logout = useCallback(() => {
    writeSessionUser(null);
    setToken(null);
    setActiveRole(null);
    setActiveRoleState(null);
    setUser(null);
  }, []);

  const selectRole = useCallback(
    (role: Role) => {
      if (!user?.roles.includes(role)) {
        throw new Error("That workspace is not granted for this account");
      }
      setActiveRole(role);
      setActiveRoleState(role);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, activeRole, login, register, logout, refresh, selectRole }),
    [user, loading, activeRole, login, register, logout, refresh, selectRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
