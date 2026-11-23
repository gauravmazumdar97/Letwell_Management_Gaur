import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { requireApprovedRole } from "@/lib/session";

export default async function AdminDashboardPage() {
  const user = await requireApprovedRole(["ADMIN"]);

  const [pendingUsers, publishedListings, openMaintenance, overdueCharges] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.listing.count({ where: { status: "PUBLISHED" } }),
    prisma.maintenanceRequest.count({ where: { status: { not: "RESOLVED" } } }),
    prisma.rentCharge.count({ where: { status: "OVERDUE" } }),
  ]);

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Admin overview</h1>
      <p className="mt-1 text-sm text-ink-900/60">Operational snapshot across Letwell.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{pendingUsers}</CardTitle>
            <CardDescription>Pending registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className="text-sm font-medium text-teal-800 hover:underline">
              Review users
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{publishedListings}</CardTitle>
            <CardDescription>Published listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/listings" className="text-sm font-medium text-teal-800 hover:underline">
              Listing oversight
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{overdueCharges}</CardTitle>
            <CardDescription>Overdue rent charges</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/rent" className="text-sm font-medium text-teal-800 hover:underline">
              Rent operations
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{openMaintenance}</CardTitle>
            <CardDescription>Open maintenance jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/maintenance" className="text-sm font-medium text-teal-800 hover:underline">
              Maintenance queue
            </Link>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
