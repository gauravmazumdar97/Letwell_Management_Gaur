import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { formatGbpFromPence, pricingUnitLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PropertyListItem = {
  id: string;
  title: string;
  neighbourhood: string;
  city: string;
  pricePence: number;
  pricingUnit: string;
  image: { url: string; alt: string } | null;
};

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => api<{ items: PropertyListItem[] }>("/api/properties?sort=newest"),
  });

  const featured = data?.items.slice(0, 6) ?? [];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0">
          <img
            src="/images/properties/hero-home.jpg"
            alt="Premium London home exterior at dusk"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(247,244,239,0.96)_0%,rgba(247,244,239,0.88)_42%,rgba(20,32,29,0.35)_100%)]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pt-24">
          <div>
            <p className="font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Letwell
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Considered homes to rent across London
            </h1>
            <p className="mt-4 max-w-lg text-base text-ink/70">
              Search approved homes with clear monthly, nightly and event pricing. Request a booking,
              then manage invoices and maintenance in one workspace.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/20 bg-ink/80 p-8 text-canvas shadow-lg backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-canvas/70">Start here</p>
            <p className="mt-3 font-serif text-3xl leading-tight">Find a home that fits your week</p>
            <p className="mt-3 text-sm text-canvas/75">
              Filters stay in the URL. Every public card is loaded from the live Letwell API.
            </p>
            <Link to="/search" className="mt-6 inline-block">
              <Button className="bg-canvas text-ink hover:bg-white">Browse all homes</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-ink">Homes available now</h2>
            <p className="mt-2 text-sm text-ink/60">Curated from approved, non-suspended listings.</p>
          </div>
          <Link to="/search" className="text-sm font-medium text-teal-800 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? <p className="mt-8 text-sm text-ink/60">Loading homes...</p> : null}
        {isError ? (
          <p className="mt-8 text-sm text-red-700" role="alert">
            Could not load homes. Check that the API is running on port 4000.
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <article key={property.id} className="group">
              <Link to={`/properties/${property.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
                  <img
                    src={property.image?.url ?? "/images/properties/clerkenwell-living.jpg"}
                    alt={property.image?.alt ?? property.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-lg font-semibold text-ink">
                    {formatGbpFromPence(property.pricePence)}{" "}
                    <span className="text-sm font-normal text-ink/55">
                      {pricingUnitLabel(property.pricingUnit)}
                    </span>
                  </p>
                  <h3 className="text-base text-ink">{property.title}</h3>
                  <p className="text-sm text-ink/60">
                    {property.neighbourhood}, {property.city}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
