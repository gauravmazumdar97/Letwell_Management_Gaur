import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink text-canvas">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-2xl">Letwell</p>
          <p className="mt-3 max-w-xs text-sm text-canvas/70">
            Independent lettings for considered London homes, with clear bookings and calm
            workspaces for tenants and managers.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-canvas/50">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" to="/search">
                Search homes
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/sign-in">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-canvas/50">Local demo</p>
          <p className="mt-3 text-sm text-canvas/70">
            Runs on your laptop with PostgreSQL, the Express API and this Vite frontend. Stripe test
            mode arrives in Week 3.
          </p>
        </div>
      </div>
    </footer>
  );
}
