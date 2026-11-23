import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatGbpFromPence } from "@/lib/money";
import { formatUkDate } from "@/lib/dates";
import { requireApprovedRole } from "@/lib/session";

export default async function TenantDashboardPage() {
  const user = await requireApprovedRole(["TENANT"]);

  const lease = await prisma.lease.findFirst({
    where: { tenantId: user.id, status: "ACTIVE" },
    include: {
      property: true,
      charges: { orderBy: { dueDate: "desc" }, take: 3 },
    },
  });

  const openRequests = await prisma.maintenanceRequest.count({
    where: { tenantId: user.id, status: { not: "RESOLVED" } },
  });

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Tenant overview</h1>
      <p className="mt-1 text-sm text-ink-900/60">Your next actions for this tenancy.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lease</CardTitle>
            <CardDescription>
              {lease
                ? `${lease.property.neighbourhood} · active until ${formatUkDate(lease.endDate)}`
                : "No active lease yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lease ? (
              <p className="text-sm text-ink-900/70">
                Monthly rent {formatGbpFromPence(lease.monthlyRentPence)}. Due day {lease.dueDay}.
              </p>
            ) : (
              <p className="text-sm text-ink-900/70">
                Browse homes and enquire once Week 2 enquiry flow is live.
              </p>
            )}
            <Link href="/tenant/lease" className="mt-4 inline-block text-sm font-medium text-teal-800 hover:underline">
              View lease details
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rent</CardTitle>
            <CardDescription>Recent charges from the ledger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(lease?.charges ?? []).length === 0 ? (
              <p className="text-sm text-ink-900/70">No charges yet.</p>
            ) : (
              lease?.charges.map((charge) => (
                <div key={charge.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{formatUkDate(charge.dueDate)}</span>
                  <span>{formatGbpFromPence(charge.amountPence)}</span>
                  <Badge variant={charge.status === "PAID" ? "success" : charge.status === "OVERDUE" ? "danger" : "warning"}>
                    {charge.status}
                  </Badge>
                </div>
              ))
            )}
            <Link href="/tenant/rent" className="inline-block text-sm font-medium text-teal-800 hover:underline">
              Open rent history
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>
              {openRequests} open {openRequests === 1 ? "request" : "requests"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tenant/maintenance" className="text-sm font-medium text-teal-800 hover:underline">
              View maintenance
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browse homes</CardTitle>
            <CardDescription>Find another property while you wait</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/search" className="text-sm font-medium text-teal-800 hover:underline">
              Search available listings
            </Link>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
