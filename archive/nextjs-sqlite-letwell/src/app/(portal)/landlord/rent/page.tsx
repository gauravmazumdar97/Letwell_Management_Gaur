import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function LandlordRentPage() {
  const user = await requireApprovedRole(["LANDLORD"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Rent performance"
      blurb="Collection totals and overdue balances for your properties land in Weeks 2-4."
    />
  );
}
