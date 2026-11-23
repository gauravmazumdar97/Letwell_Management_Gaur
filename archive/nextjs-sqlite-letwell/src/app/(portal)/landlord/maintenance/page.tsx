import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function LandlordMaintenancePage() {
  const user = await requireApprovedRole(["LANDLORD"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Maintenance"
      blurb="View maintenance for properties you own from Week 4."
    />
  );
}
