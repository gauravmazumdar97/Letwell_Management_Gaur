import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatUkDate } from "@/lib/dates";
import { maintenanceStatusLabel } from "@/lib/labels";
import { requireApprovedRole } from "@/lib/session";

export default async function TenantMaintenancePage() {
  const user = await requireApprovedRole(["TENANT"]);

  const requests = await prisma.maintenanceRequest.findMany({
    where: { tenantId: user.id },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Maintenance</h1>
      <p className="mt-1 text-sm text-ink-900/60">
        Your requests. Submission UI and status history deepen in Weeks 2-3.
      </p>

      <ul className="mt-8 space-y-3">
        {requests.length === 0 ? (
          <li className="rounded-xl border border-dashed border-ink-900/15 p-6 text-sm text-ink-900/60">
            No maintenance requests yet.
          </li>
        ) : (
          requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-900/10 bg-white/80 px-4 py-4"
            >
              <div>
                <p className="font-medium text-ink-900">{request.title}</p>
                <p className="text-sm text-ink-900/55">
                  {request.property.neighbourhood} · {formatUkDate(request.createdAt)} ·{" "}
                  {request.urgency}
                </p>
              </div>
              <Badge>{maintenanceStatusLabel[request.status]}</Badge>
            </li>
          ))
        )}
      </ul>

      <p className="mt-4 text-sm">
        <Link href="/tenant" className="text-teal-800 hover:underline">
          Back to overview
        </Link>
      </p>
    </PortalShell>
  );
}
