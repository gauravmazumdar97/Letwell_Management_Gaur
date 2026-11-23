import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

export default async function PendingAccountPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-ink-900">Account pending approval</h1>
      <p className="mt-3 text-sm text-ink-900/65">
        Hello {user.name}. Your {user.role.toLowerCase()} registration is waiting for an
        administrator. You cannot open a workspace until the account is approved.
      </p>
      <form action={signOutAction} className="mt-8">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/" className="text-teal-800 hover:underline">
          Return home
        </Link>
      </p>
    </main>
  );
}
