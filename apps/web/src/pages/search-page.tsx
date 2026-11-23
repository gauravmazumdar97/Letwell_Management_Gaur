import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatGbpFromPence, pricingUnitLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PropertyListItem = {
  id: string;
  title: string;
  neighbourhood: string;
  city: string;
  pricePence: number;
  pricingUnit: string;
  image: { url: string; alt: string } | null;
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const queryString = useMemo(() => params.toString(), [params]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", queryString],
    queryFn: () =>
      api<{ items: PropertyListItem[] }>(`/api/properties${queryString ? `?${queryString}` : ""}`),
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    for (const key of ["location", "category", "pricingUnit", "minPrice", "maxPrice", "sort"]) {
      const value = String(form.get(key) ?? "").trim();
      if (value) next.set(key, value);
    }
    setParams(next);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">Search homes</h1>
      <p className="mt-2 text-sm text-ink/65">
        Filters stay in the URL so shared links and back navigation restore the same search.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-4 rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-sm md:grid-cols-3 lg:grid-cols-6"
      >
        <div className="lg:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={params.get("location") ?? ""} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="pricingUnit">Pricing unit</Label>
          <select
            id="pricingUnit"
            name="pricingUnit"
            defaultValue={params.get("pricingUnit") ?? ""}
            className="mt-2 flex h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm"
          >
            <option value="">Any</option>
            <option value="MONTHLY">Monthly</option>
            <option value="DAILY">Daily</option>
            <option value="NIGHTLY">Nightly</option>
            <option value="EVENT">Event</option>
          </select>
        </div>
        <div>
          <Label htmlFor="minPrice">Min price (£)</Label>
          <Input id="minPrice" name="minPrice" type="number" defaultValue={params.get("minPrice") ?? ""} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max price (£)</Label>
          <Input id="maxPrice" name="maxPrice" type="number" defaultValue={params.get("maxPrice") ?? ""} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="sort">Sort</Label>
          <select
            id="sort"
            name="sort"
            defaultValue={params.get("sort") ?? "newest"}
            className="mt-2 flex h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
        <div className="lg:col-span-6">
          <Button type="submit">Search homes</Button>
        </div>
      </form>

      <p className="mt-8 text-sm text-ink/70">{data?.items.length ?? 0} homes</p>
      {isLoading ? <p className="mt-4 text-sm text-ink/60">Loading...</p> : null}
      {isError ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          Search failed. Try refreshing the page.
        </p>
      ) : null}

      {!isLoading && data?.items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink/15 p-10 text-center text-sm text-ink/65">
          No homes match those filters. Try another pricing unit or clear the location.
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((property) => (
          <article key={property.id}>
            <Link to={`/properties/${property.id}`} className="block">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
                <img
                  src={property.image?.url ?? "/images/properties/clerkenwell-living.jpg"}
                  alt={property.image?.alt ?? property.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-4 text-lg font-semibold">
                {formatGbpFromPence(property.pricePence)}{" "}
                <span className="text-sm font-normal text-ink/55">
                  {pricingUnitLabel(property.pricingUnit)}
                </span>
              </p>
              <h2 className="text-base">{property.title}</h2>
              <p className="text-sm text-ink/60">
                {property.neighbourhood}, {property.city}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
