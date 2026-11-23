import { PropertyCard } from "@/components/listings/property-card";
import { SearchForm } from "@/components/listings/search-form";
import { getPublicListings } from "@/lib/listings";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = {
    location: first(params.location),
    minRent: first(params.minRent),
    maxRent: first(params.maxRent),
    bedrooms: first(params.bedrooms),
    propertyType: first(params.propertyType),
    sort: first(params.sort),
  };

  const listings = await getPublicListings(filters);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-ink-900">Search homes</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-900/65">
        Filters stay in the URL so you can share a search or use the browser back button.
      </p>

      <div className="mt-8">
        <SearchForm defaults={filters} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-900/70">
          {listings.length} {listings.length === 1 ? "home" : "homes"} matching your filters
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-900/15 bg-white/50 p-10 text-center">
          <p className="text-base font-medium text-ink-900">No homes match those filters</p>
          <p className="mt-2 text-sm text-ink-900/60">
            Try a wider rent range or clear the bedroom filter. Draft, archived and occupied homes stay
            out of public results.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const image = listing.property.images[0];
            return (
              <PropertyCard
                key={listing.id}
                id={listing.propertyId}
                headline={listing.headline}
                neighbourhood={listing.property.neighbourhood}
                city={listing.property.city}
                monthlyRentPence={listing.monthlyRentPence}
                bedrooms={listing.property.bedrooms}
                propertyType={listing.property.propertyType}
                imageUrl={image?.url ?? "/images/properties/clerkenwell-1.svg"}
                imageAlt={image?.alt ?? listing.headline}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
