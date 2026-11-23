import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { accountStatusLabel, roleLabel } from "@/lib/labels";
import { requireApprovedRole } from "@/lib/session";

export default async function AdminUsersPage() {
  const user = await requireApprovedRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return (
    <PortalShell role={user.role} name={user.name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Users</h1>
      <p className="mt-1 text-sm text-ink-900/60">
        Approval actions arrive in Week 2. This list confirms seeded roles and statuses.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-ink-900/10 bg-white/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-900/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.id} className="border-b border-ink-900/5 last:border-0">
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{roleLabel[row.role]}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      row.status === "APPROVED"
                        ? "success"
                        : row.status === "PENDING"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {accountStatusLabel[row.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm">
        <Link href="/admin" className="text-teal-800 hover:underline">
          Back to overview
        </Link>
      </p>
    </PortalShell>
  );
}
