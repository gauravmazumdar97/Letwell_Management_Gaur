import { ComingSoonPage } from "@/components/portal/coming-soon";
import { requireApprovedRole } from "@/lib/session";

export default async function AdminRentPage() {
  const user = await requireApprovedRole(["ADMIN"]);
  return (
    <ComingSoonPage
      role={user.role}
      name={user.name}
      title="Rent operations"
      blurb="Charge generation and platform reports are Week 3-4 work. Models and seeded overdue charges are already in the database."
    />
  );
}
