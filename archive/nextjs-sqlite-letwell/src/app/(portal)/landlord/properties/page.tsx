import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function LandlordPropertiesPage() {
  const user = await requireApprovedRole(["LANDLORD"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Properties"
      blurb="Create, edit, publish and archive listings for your own properties in Week 2."
    />
  );
}
