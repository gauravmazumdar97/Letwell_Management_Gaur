import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-ink-900">Create an account</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-900/65">
        Self-registration for tenants and landlords lands in Week 2, together with the admin approval
        queue. For Week 1, sign in with a seeded account to explore each workspace.
      </p>
      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white/80 p-6">
        <p className="text-sm text-ink-900/70">
          Seeded roles are documented in the README. New registrations will start as{" "}
          <strong>pending</strong> and cannot access protected data until an admin approves them.
        </p>
        <Link href="/sign-in" className="mt-6 inline-block">
          <Button>Go to sign in</Button>
        </Link>
      </div>
    </main>
  );
}
