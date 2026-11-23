import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";
import { dashboardPathForRole } from "@/lib/session";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth();
  const dashboardHref = session?.user ? dashboardPathForRole(session.user.role) : null;

  return (
    <header className="border-b border-ink-900/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl tracking-tight text-ink-900">
          Letwell
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            className="rounded-md px-3 py-2 text-sm text-ink-900/80 hover:bg-ink-900/5 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            Browse homes
          </Link>
          {dashboardHref ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-md px-3 py-2 text-sm text-ink-900/80 hover:bg-ink-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
              >
                Dashboard
              </Link>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
