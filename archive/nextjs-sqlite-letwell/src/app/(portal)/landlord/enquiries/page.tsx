import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function LandlordEnquiriesPage() {
  const user = await requireApprovedRole(["LANDLORD"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Enquiries"
      blurb="Review and accept or decline tenant enquiries in Week 2."
    />
  );
}
