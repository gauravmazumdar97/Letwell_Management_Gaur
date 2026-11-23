import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function AdminListingsPage() {
  const user = await requireApprovedRole(["ADMIN"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Listings oversight"
      blurb="Cross-platform listing management expands after landlord publishing lands in Week 2."
    />
  );
}
