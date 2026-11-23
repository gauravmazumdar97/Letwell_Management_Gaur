import Link from "next/link";
import { PropertyCard } from "@/components/listings/property-card";
import { SearchForm } from "@/components/listings/search-form";
import { getFeaturedListings } from "@/lib/listings";

export default async function HomePage() {
  const featured = await getFeaturedListings(3);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pt-20">
          <div>
            <p className="font-serif text-5xl leading-[1.05] tracking-tight text-ink-900 sm:text-6xl lg:text-7xl">
              Letwell
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
              Considered homes to rent across London
            </h1>
            <p className="mt-4 max-w-lg text-base text-ink-900/65">
              Search available flats, houses and studios from independent landlords. Clear listings,
              calm interiors and a tenancy workspace when you are ready to move.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,#1f5c55_0%,#163f3b_55%,#8b6914_140%)] p-8 text-canvas shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-canvas/70">Start here</p>
            <p className="mt-3 font-serif text-3xl leading-tight">Find a home that fits your week</p>
            <p className="mt-3 text-sm text-canvas/75">
              Filter by neighbourhood, rent and bedrooms. Every public listing is live against the
              local database.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex h-11 items-center rounded-md bg-canvas px-5 text-sm font-medium text-ink-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Browse all homes
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SearchForm compact />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-ink-900">Homes available now</h2>
            <p className="mt-2 text-sm text-ink-900/60">A curated selection from the seeded catalogue.</p>
          </div>
          <Link href="/search" className="text-sm font-medium text-teal-800 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="text-sm text-ink-900/60">No published homes yet. Seed the database to populate listings.</p>
          ) : (
            featured.map((listing) => {
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
            })
          )}
        </div>
      </section>
    </main>
  );
}
