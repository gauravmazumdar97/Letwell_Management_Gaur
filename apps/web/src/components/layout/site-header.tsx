import { Link } from "react-router-dom";
import { useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/api";

function preferredRole(roles: Role[], activeRole: Role | null): Role | null {
  if (activeRole && roles.includes(activeRole)) return activeRole;
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("MANAGER")) return "MANAGER";
  if (roles.includes("TENANT")) return "TENANT";
  return null;
}

function workspacePath(role: Role | null): string {
  if (role === "ADMIN") return "/app/admin";
  if (role === "MANAGER") return "/app/manager";
  if (role === "TENANT") return "/app/tenant";
  return "/sign-in";
}

export function SiteHeader() {
  const { user, activeRole, logout } = useAuth();
  const role = user ? preferredRole(user.roles, activeRole) : null;

  return (
    <header className="border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="font-serif text-2xl tracking-tight text-ink">
          Letwell
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link to="/search" className="rounded-md px-3 py-2 text-sm text-ink/80 hover:bg-ink/5">
            Browse homes
          </Link>
          {user ? (
            <>
              <Link
                to={workspacePath(role)}
                className="rounded-md px-3 py-2 text-sm text-ink/80 hover:bg-ink/5"
              >
                Dashboard
              </Link>
              <Button type="button" variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
