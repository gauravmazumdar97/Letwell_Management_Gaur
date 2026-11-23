import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { maintenanceStatusLabel } from "@/lib/labels";
import { requireApprovedRole } from "@/lib/session";

export default async function AdminMaintenancePage() {
  const user = await requireApprovedRole(["ADMIN"]);

  const requests = await prisma.maintenanceRequest.findMany({
    include: { property: true, tenant: true, worker: true },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
  });

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Maintenance queue</h1>
      <p className="mt-1 text-sm text-ink-900/60">
        Seeded jobs for demo. Assignment and transitions land in Weeks 2-3.
      </p>

      <ul className="mt-8 space-y-3">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-900/10 bg-white/80 px-4 py-4"
          >
            <div>
              <p className="font-medium text-ink-900">{request.title}</p>
              <p className="text-sm text-ink-900/55">
                {request.property.neighbourhood} · {request.tenant.name} · {request.urgency}
                {request.worker ? ` · ${request.worker.name}` : ""}
              </p>
            </div>
            <Badge>{maintenanceStatusLabel[request.status]}</Badge>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm">
        <Link href="/admin" className="text-teal-800 hover:underline">
          Back to overview
        </Link>
      </p>
    </PortalShell>
  );
}
