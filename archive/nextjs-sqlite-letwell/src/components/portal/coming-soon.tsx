import { PortalShell } from "@/components/layout/portal-shell";
import type { Role } from "@prisma/client";

export function ComingSoonPage({
  role,
  name,
  title,
  blurb,
}: {
  role: Role;
  name: string;
  title: string;
  blurb: string;
}) {
  return (
    <PortalShell role={role} name={name}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-900/65">{blurb}</p>
      <div className="mt-8 rounded-xl border border-dashed border-ink-900/15 bg-white/50 p-8 text-sm text-ink-900/70">
        Scheduled for a later weekly milestone. Navigation is in place so Week 1 dashboards stay
        coherent.
      </div>
    </PortalShell>
  );
}
