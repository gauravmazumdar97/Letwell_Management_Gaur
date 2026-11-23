import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useAuth } from "@/auth/auth-context";
import { HomePage } from "@/pages/home-page";
import { SearchPage } from "@/pages/search-page";
import { PropertyDetailPage } from "@/pages/property-detail-page";
import { SignInPage } from "@/pages/sign-in-page";
import { RegisterPage } from "@/pages/register-page";
import { AccountStatusPage } from "@/pages/account-status-page";
import { WorkspacePage } from "@/pages/workspace-page";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) {
    return <main className="p-8 text-sm text-ink/60">Checking session...</main>;
  }
  if (!user) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) {
    return <main className="p-8 text-sm text-ink/60">Checking session...</main>;
  }
  if (user) {
    if (user.roles.includes("ADMIN")) return <Navigate to="/app/admin" replace />;
    if (user.roles.includes("MANAGER")) return <Navigate to="/app/manager" replace />;
    return <Navigate to="/app/tenant" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />

        <Route element={<GuestOnly />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route
            path="/account/pending"
            element={
              <AccountStatusPage
                title="Account pending approval"
                body="Your registration is waiting for an administrator. Protected workspace data stays locked."
              />
            }
          />
          <Route
            path="/account/rejected"
            element={
              <AccountStatusPage
                title="Registration not approved"
                body="This account was rejected and cannot open Letwell workspaces."
              />
            }
          />
          <Route
            path="/account/suspended"
            element={
              <AccountStatusPage
                title="Account suspended"
                body="This account is suspended. Protected data remains locked even with a local token."
              />
            }
          />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/app/tenant" element={<WorkspacePage role="TENANT" />} />
        <Route path="/app/manager" element={<WorkspacePage role="MANAGER" />} />
        <Route path="/app/admin" element={<WorkspacePage role="ADMIN" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
