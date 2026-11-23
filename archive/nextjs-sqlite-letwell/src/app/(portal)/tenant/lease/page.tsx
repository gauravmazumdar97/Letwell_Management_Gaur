import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function TenantLeasePage() {
  const user = await requireApprovedRole(["TENANT"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Lease"
      blurb="Printable lease view and agreement details arrive with Week 3 lease activation."
    />
  );
}
