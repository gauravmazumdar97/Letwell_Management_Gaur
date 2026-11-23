import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatUkDate } from "@/lib/dates";
import { formatGbpFromPence } from "@/lib/money";
import { requireApprovedRole } from "@/lib/session";

export default async function TenantRentPage() {
  const user = await requireApprovedRole(["TENANT"]);

  const charges = await prisma.rentCharge.findMany({
    where: { lease: { tenantId: user.id } },
    include: { payment: true, lease: { include: { property: true } } },
    orderBy: { dueDate: "desc" },
  });

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Rent</h1>
      <p className="mt-1 text-sm text-ink-900/60">
        Seeded charges for your leases. Demo payment actions arrive in Week 3.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-ink-900/10 bg-white/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-900/50">
            <tr>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {charges.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-900/60">
                  No rent charges yet.
                </td>
              </tr>
            ) : (
              charges.map((charge) => (
                <tr key={charge.id} className="border-b border-ink-900/5 last:border-0">
                  <td className="px-4 py-3">{formatUkDate(charge.dueDate)}</td>
                  <td className="px-4 py-3">{charge.lease.property.neighbourhood}</td>
                  <td className="px-4 py-3">{formatGbpFromPence(charge.amountPence)}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        charge.status === "PAID"
                          ? "success"
                          : charge.status === "OVERDUE"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {charge.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{charge.payment?.receiptRef ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm">
        <Link href="/tenant" className="text-teal-800 hover:underline">
          Back to overview
        </Link>
      </p>
    </PortalShell>
  );
}
