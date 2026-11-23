import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatGbpFromPence } from "@/lib/money";
import { requireApprovedRole } from "@/lib/session";

export default async function LandlordDashboardPage() {
  const user = await requireApprovedRole(["LANDLORD"]);

  const properties = await prisma.property.findMany({
    where: { landlordId: user.id },
    include: { listing: true },
    orderBy: { updatedAt: "desc" },
  });

  const published = properties.filter((p) => p.listing?.status === "PUBLISHED").length;
  const occupied = properties.filter((p) => p.status === "OCCUPIED").length;

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Landlord overview</h1>
      <p className="mt-1 text-sm text-ink-900/60">Manage your portfolio and respond to interest.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{properties.length}</CardTitle>
            <CardDescription>Properties</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{published}</CardTitle>
            <CardDescription>Published listings</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{occupied}</CardTitle>
            <CardDescription>Occupied</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your properties</CardTitle>
          <CardDescription>Listing management expands in Week 2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.length === 0 ? (
            <p className="text-sm text-ink-900/70">No properties seeded for this landlord.</p>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-900/5 pb-3 text-sm last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-ink-900">{property.title}</p>
                  <p className="text-ink-900/55">
                    {property.neighbourhood} · {property.status}
                    {property.listing ? ` · ${property.listing.status}` : ""}
                  </p>
                </div>
                {property.listing ? (
                  <p className="font-medium">{formatGbpFromPence(property.listing.monthlyRentPence)} pcm</p>
                ) : null}
              </div>
            ))
          )}
          <Link href="/landlord/properties" className="inline-block text-sm font-medium text-teal-800 hover:underline">
            Open property workspace
          </Link>
        </CardContent>
      </Card>
    </PortalShell>
  );
}
