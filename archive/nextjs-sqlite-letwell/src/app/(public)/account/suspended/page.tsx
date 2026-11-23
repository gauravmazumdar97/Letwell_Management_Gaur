import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

export default async function SuspendedAccountPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-ink-900">Account suspended</h1>
      <p className="mt-3 text-sm text-ink-900/65">
        {user.name}, this account is suspended. Protected data stays locked even if a previous
        session still exists. Speak with an administrator to restore access.
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
