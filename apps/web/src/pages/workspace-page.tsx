import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth-context";
import type { AuthUser, Role } from "@/lib/api";
import { Button } from "@/components/ui/button";

function workspacePath(role: Role): string {
  if (role === "ADMIN") return "/app/admin";
  if (role === "MANAGER") return "/app/manager";
  return "/app/tenant";
}

function RoleSwitcher({
  user,
  activeRole,
  onSelect,
  tone = "dark",
}: {
  user: AuthUser;
  activeRole: Role | null;
  onSelect: (role: Role) => void;
  tone?: "dark" | "light" | "warm";
}) {
  if (user.roles.length < 2) return null;

  const styles =
    tone === "light"
      ? {
          active: "bg-ink text-white",
          idle: "bg-ink/5 text-ink hover:bg-ink/10",
        }
      : tone === "warm"
        ? {
            active: "bg-[#2f2418] text-[#efe8dc]",
            idle: "bg-[#5c4632]/15 text-[#5c4632] hover:bg-[#5c4632]/25",
          }
        : {
            active: "bg-white text-ink",
            idle: "bg-white/10 text-white/80 hover:bg-white/20",
          };

  return (
    <div className="flex flex-wrap gap-2">
      {user.roles.map((granted) => (
        <button
          key={granted}
          type="button"
          onClick={() => onSelect(granted)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            activeRole === granted ? styles.active : styles.idle
          }`}
        >
          {granted}
        </button>
      ))}
    </div>
  );
}

function AdminDashboard({
  user,
  activeRole,
  onSelectRole,
  onLogout,
}: {
  user: AuthUser;
  activeRole: Role | null;
  onSelectRole: (role: Role) => void;
  onLogout: () => void;
}) {
  const approvals = [
    {
      name: "Callum Reid",
      detail: "Tenant application · London",
      age: "2 hours ago",
      tag: "Tenant",
    },
    {
      name: "Priya Shah",
      detail: "Manager application · 2 planned listings",
      age: "5 hours ago",
      tag: "Manager",
    },
    {
      name: "Hackney canal maisonette",
      detail: "Listing photos need a final check",
      age: "1 day ago",
      tag: "Listing",
    },
  ];

  const alerts = [
    { title: "Suspended rent dispute", body: "Hannah Cole · needs admin note", tone: "urgent" },
    { title: "Duplicate email report", body: "Registration attempt blocked", tone: "watch" },
    { title: "Category request", body: "Manager asked for Serviced flats", tone: "info" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f5]">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <Link to="/" className="font-serif text-2xl text-ink">
              Letwell
            </Link>
            <p className="mt-1 text-sm text-ink/55">Admin workspace · {user.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RoleSwitcher user={user} activeRole={activeRole} onSelect={onSelectRole} tone="light" />
            <Button type="button" size="sm" variant="outline" onClick={onLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <section className="rounded-[1.75rem] bg-white px-6 py-7 shadow-sm ring-1 ring-ink/5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-teal-800">Platform overview</p>
              <h1 className="mt-2 font-serif text-4xl text-ink">Admin dashboard</h1>
              <p className="mt-2 max-w-xl text-sm text-ink/60">
                Approve people, moderate listings, and keep platform income tidy.
              </p>
            </div>
            <Link to="/search">
              <Button variant="outline">Open public search</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Pending approvals", value: "4", hint: "People waiting" },
              { label: "Listings to check", value: "2", hint: "Photo review" },
              { label: "Active managers", value: "3", hint: "Approved hosts" },
              { label: "Platform fees", value: "£1,240", hint: "This month" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[#eef5f3] px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-ink/45">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-1 text-sm text-ink/55">{stat.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
          <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl text-ink">Approval queue</h2>
              <span className="rounded-full bg-teal-800/10 px-3 py-1 text-xs font-medium text-teal-900">
                {approvals.length} open
              </span>
            </div>

            <ul className="mt-6 space-y-4">
              {approvals.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-col gap-4 rounded-2xl border border-ink/8 bg-[#f8fbfa] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{item.name}</p>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-teal-900 ring-1 ring-teal-800/15">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{item.detail}</p>
                    <p className="mt-1 text-xs text-ink/40">{item.age}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm">
                      Approve
                    </Button>
                    <Button type="button" size="sm" variant="outline">
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-ink/5">
              <h2 className="font-serif text-2xl text-ink">Income pulse</h2>
              <p className="mt-2 text-sm text-ink/60">Demo platform fees collected this month</p>
              <p className="mt-5 font-serif text-5xl text-teal-900">£1,240</p>
              <div className="mt-6 flex h-24 items-end gap-2">
                {[36, 52, 44, 70, 58, 84, 63].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-md bg-teal-800/80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-ink/35">
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-ink/5">
              <h2 className="font-serif text-2xl text-ink">Alerts</h2>
              <ul className="mt-5 space-y-3">
                {alerts.map((alert) => (
                  <li key={alert.title} className="rounded-2xl border border-ink/8 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{alert.title}</p>
                        <p className="mt-1 text-sm text-ink/55">{alert.body}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          alert.tone === "urgent"
                            ? "bg-red-50 text-red-700"
                            : alert.tone === "watch"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-teal-50 text-teal-900"
                        }`}
                      >
                        {alert.tone}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({
  user,
  activeRole,
  onSelectRole,
  onLogout,
}: {
  user: AuthUser;
  activeRole: Role | null;
  onSelectRole: (role: Role) => void;
  onLogout: () => void;
}) {
  const portfolio = [
    {
      title: "Clerkenwell one-bed",
      status: "Let",
      rent: "£2,150 pcm",
      image: "/images/properties/clerkenwell-living.jpg",
    },
    {
      title: "Shoreditch loft",
      status: "Nightly",
      rent: "£145 / night",
      image: "/images/properties/shoreditch-loft.jpg",
    },
    {
      title: "Balham terrace",
      status: "Let",
      rent: "£3,850 pcm",
      image: "/images/properties/balham-house.jpg",
    },
    {
      title: "Notting Hill flat",
      status: "Open",
      rent: "£4,250 pcm",
      image: "/images/properties/notting-hill-living.jpg",
    },
  ];

  const bookings = [
    { guest: "James Okonkwo", home: "Shoreditch loft", dates: "12-15 Dec", action: "Approve" },
    { guest: "Aisha Khan", home: "Notting Hill flat", dates: "Viewing Thu", action: "Schedule" },
    { guest: "Tom Ellis", home: "Greenwich house", dates: "1 Jan start", action: "Review" },
  ];

  return (
    <div className="min-h-screen bg-[#efe8dc]">
      <div className="border-b border-[#d7cbb8] bg-[#e7dccb]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-8 sm:px-6">
          <div>
            <p className="text-sm text-[#6d5b45]">Portfolio desk</p>
            <h1 className="mt-1 font-serif text-4xl text-ink sm:text-5xl">
              Hello, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-md text-sm text-ink/65">
              Your homes, booking inbox and rent pulse in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RoleSwitcher user={user} activeRole={activeRole} onSelect={onSelectRole} tone="warm" />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-[#5c4632]/40"
              onClick={onLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl text-ink">Your portfolio</h2>
            <Link to="/search" className="text-sm font-medium text-[#5c4632] hover:underline">
              See public cards
            </Link>
          </div>
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            {portfolio.map((home) => (
              <article
                key={home.title}
                className="w-64 shrink-0 overflow-hidden rounded-[1.25rem] bg-[#2f2418] text-[#efe8dc] shadow-md"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <img src={home.image} alt={home.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#d7cbb8]">{home.status}</p>
                  <h3 className="mt-2 text-base font-medium">{home.title}</h3>
                  <p className="mt-1 text-sm text-[#d7cbb8]">{home.rent}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-[#d7cbb8] bg-[#f7f1e8] p-6">
            <h2 className="font-serif text-2xl text-ink">Booking inbox</h2>
            <ul className="mt-5 divide-y divide-[#d7cbb8]">
              {bookings.map((item) => (
                <li
                  key={item.guest}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-medium text-ink">{item.guest}</p>
                    <p className="text-sm text-ink/60">
                      {item.home} · {item.dates}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-[#5c4632] px-4 py-2 text-xs font-medium text-[#efe8dc]"
                  >
                    {item.action}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] bg-[#2f2418] p-6 text-[#efe8dc]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d7cbb8]">Rent this month</p>
            <p className="mt-3 font-serif text-5xl">£8,420</p>
            <p className="mt-2 text-sm text-[#d7cbb8]">Expected across live tenancies</p>
            <div className="mt-8 space-y-3">
              {[
                { label: "Collected", value: 68 },
                { label: "Due soon", value: 22 },
                { label: "Overdue", value: 10 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-xs text-[#d7cbb8]">
                    <span>{row.label}</span>
                    <span>{row.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-[#c4a574]"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TenantDashboard({
  user,
  activeRole,
  onSelectRole,
  onLogout,
}: {
  user: AuthUser;
  activeRole: Role | null;
  onSelectRole: (role: Role) => void;
  onLogout: () => void;
}) {
  const timeline = [
    { title: "Booking sent", detail: "Clerkenwell one-bed · waiting on manager", when: "Yesterday" },
    { title: "Rent reminder", detail: "£2,150 due 1 Dec", when: "3 days ago" },
    { title: "Shortlisted", detail: "Notting Hill bay-window flat", when: "Last week" },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/properties/clerkenwell-living.jpg"
          alt="Current shortlisted home"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,32,29,0.55)_0%,rgba(20,32,29,0.82)_100%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-14 pt-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="font-serif text-2xl text-white">
              Letwell
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <RoleSwitcher user={user} activeRole={activeRole} onSelect={onSelectRole} tone="dark" />
              <Button
                type="button"
                size="sm"
                className="bg-white text-ink hover:bg-canvas"
                onClick={onLogout}
              >
                Sign out
              </Button>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Your place</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-white sm:text-5xl">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-4 text-base text-white/75">
              One booking is waiting for approval. Keep browsing while that decision comes through.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/search">
                <Button className="bg-teal-700 text-white hover:bg-teal-800">Browse homes</Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Pay next rent
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] bg-teal-900 p-6 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Next rent</p>
          <p className="mt-4 font-serif text-5xl">£2,150</p>
          <p className="mt-2 text-sm text-white/70">Due 1 December · Clerkenwell one-bed</p>
          <div className="mt-8 rounded-[1.5rem] bg-white/10 p-4">
            <p className="text-sm font-medium">Maintenance</p>
            <p className="mt-1 text-sm text-white/70">No open tickets. Raise one if something breaks.</p>
            <button
              type="button"
              className="mt-4 text-sm text-teal-100 underline-offset-2 hover:underline"
            >
              Report an issue
            </button>
          </div>
        </aside>

        <section>
          <h2 className="font-serif text-3xl text-ink">Your recent activity</h2>
          <ol className="mt-6 space-y-0">
            {timeline.map((item, index) => (
              <li key={item.title} className="relative grid grid-cols-[1rem_1fr] gap-4 pb-8">
                <div className="relative flex justify-center">
                  <span className="mt-1 h-3 w-3 rounded-full bg-teal-700" />
                  {index < timeline.length - 1 ? (
                    <span className="absolute top-4 bottom-0 w-px bg-ink/15" />
                  ) : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-medium text-ink">{item.title}</h3>
                    <p className="text-xs text-ink/45">{item.when}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink/65">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Link
              to="/search?location=Notting+Hill"
              className="group overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/images/properties/notting-hill-living.jpg"
                  alt="Notting Hill flat"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-ink">Keep exploring Notting Hill</p>
                <p className="mt-1 text-xs text-ink/55">Open search with that neighbourhood</p>
              </div>
            </Link>
            <Link
              to="/search?location=Camden"
              className="group overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/images/properties/camden-loft.jpg"
                  alt="Camden loft"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-ink">Camden warehouse nights</p>
                <p className="mt-1 text-xs text-ink/55">Nightly stays near the lock</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function WorkspacePage({ role }: { role: Role }) {
  const { user, activeRole, selectRole, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <main className="p-8 text-sm">Please sign in.</main>;
  }

  if (!user.roles.includes(role)) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="text-2xl font-semibold">Workspace not granted</h1>
        <p className="mt-2 text-sm text-ink/65">
          Your account does not include the {role.toLowerCase()} role.
        </p>
        <Link to="/" className="mt-4 inline-block text-teal-800 hover:underline">
          Go home
        </Link>
      </main>
    );
  }

  function onSelectRole(next: Role) {
    selectRole(next);
    navigate(workspacePath(next));
  }

  if (role === "ADMIN") {
    return (
      <AdminDashboard
        user={user}
        activeRole={activeRole}
        onSelectRole={onSelectRole}
        onLogout={logout}
      />
    );
  }

  if (role === "MANAGER") {
    return (
      <ManagerDashboard
        user={user}
        activeRole={activeRole}
        onSelectRole={onSelectRole}
        onLogout={logout}
      />
    );
  }

  return (
    <TenantDashboard
      user={user}
      activeRole={activeRole}
      onSelectRole={onSelectRole}
      onLogout={logout}
    />
  );
}
