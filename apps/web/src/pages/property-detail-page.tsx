import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { formatGbpFromPence, pricingUnitLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth-context";

type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  neighbourhood: string;
  city: string;
  postcode: string;
  addressLine1: string;
  pricingUnit: string;
  pricePence: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: { id: string; url: string; alt: string }[];
};

export function PropertyDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => api<PropertyDetail>(`/api/properties/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink/60">Loading property...</main>;
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Property not available</h1>
        <p className="mt-2 text-sm text-ink/65">It may be draft, rejected or suspended.</p>
        <Link to="/search" className="mt-6 inline-block text-teal-800 hover:underline">
          Back to search
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-red-700" role="alert">
        Could not load this property.
      </main>
    );
  }

  const hero = data.images[0];
  const gallery = data.images.slice(1, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 lg:aspect-auto lg:min-h-[28rem]">
          <img
            src={hero?.url ?? "/images/properties/clerkenwell-living.jpg"}
            alt={hero?.alt ?? data.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {(gallery.length > 0 ? gallery : data.images.slice(0, 2)).map((image) => (
            <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 lg:min-h-[13.5rem]">
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ink/50">
            {data.neighbourhood}, {data.city}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{data.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">{data.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {data.amenities.map((item) => (
              <li key={item} className="rounded-md bg-ink/5 px-2.5 py-1 text-xs text-ink/70">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-ink/10 bg-white/80 p-6 shadow-sm">
          <p className="text-3xl font-semibold text-ink">
            {formatGbpFromPence(data.pricePence)}{" "}
            <span className="text-base font-normal text-ink/55">
              {pricingUnitLabel(data.pricingUnit)}
            </span>
          </p>
          <p className="mt-2 text-sm text-ink/65">
            {data.addressLine1}, {data.postcode}
          </p>
          <p className="mt-1 text-sm text-ink/65">
            {data.bedrooms === 0 ? "Studio" : `${data.bedrooms} bedrooms`} · {data.bathrooms} bathrooms
          </p>
          {user?.roles.includes("TENANT") && user.status === "APPROVED" ? (
            <Button className="mt-6 w-full" type="button" disabled>
              Request booking (Week 2)
            </Button>
          ) : (
            <Link to="/sign-in" className="mt-6 block">
              <Button className="w-full">Sign in to request a booking</Button>
            </Link>
          )}
          <p className="mt-3 text-xs text-ink/55">
            Booking approval and rental creation land in Week 2. The action is visible but not yet
            enabled against the API.
          </p>
        </aside>
      </div>
    </main>
  );
}
