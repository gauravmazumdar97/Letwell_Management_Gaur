import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { roleLabel } from "@/lib/labels";
import type { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string };

const navByRole: Record<Role, NavItem[]> = {
  TENANT: [
    { href: "/tenant", label: "Overview" },
    { href: "/tenant/lease", label: "Lease" },
    { href: "/tenant/rent", label: "Rent" },
    { href: "/tenant/maintenance", label: "Maintenance" },
  ],
  LANDLORD: [
    { href: "/landlord", label: "Overview" },
    { href: "/landlord/properties", label: "Properties" },
    { href: "/landlord/enquiries", label: "Enquiries" },
    { href: "/landlord/rent", label: "Rent" },
    { href: "/landlord/maintenance", label: "Maintenance" },
  ],
  ADMIN: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/listings", label: "Listings" },
    { href: "/admin/rent", label: "Rent" },
    { href: "/admin/maintenance", label: "Maintenance" },
  ],
};

export function PortalShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const items = navByRole[role];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-xl border border-ink-900/10 bg-white/70 p-4">
            <Link href="/" className="font-serif text-xl text-ink-900">
              Letwell
            </Link>
            <p className="mt-3 text-sm font-medium text-ink-900">{name}</p>
            <p className="text-xs text-ink-900/55">{roleLabel[role]} workspace</p>
            <nav aria-label="Workspace" className="mt-6 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-ink-900/80 hover:bg-ink-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={signOutAction} className="mt-6">
              <Button type="submit" variant="outline" size="sm" className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
