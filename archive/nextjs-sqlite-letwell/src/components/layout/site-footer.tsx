import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-900/10 bg-ink-900 text-canvas">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-2xl">Letwell</p>
          <p className="mt-3 max-w-xs text-sm text-canvas/70">
            Independent lettings for considered London homes. Browse available properties and manage
            your tenancy in one place.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-canvas/50">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/search">
                Search homes
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/sign-in">
                Sign in
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/register">
                Create an account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-canvas/50">Demo note</p>
          <p className="mt-3 text-sm text-canvas/70">
            Letwell runs fully offline with seeded UK data. No cloud services or payment providers
            are required.
          </p>
        </div>
      </div>
    </footer>
  );
}
