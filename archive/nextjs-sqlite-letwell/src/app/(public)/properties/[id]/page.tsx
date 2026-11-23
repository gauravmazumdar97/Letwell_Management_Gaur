import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUkDate } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { propertyTypeLabel } from "@/lib/labels";
import { formatGbpFromPence } from "@/lib/money";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      listing: true,
    },
  });

  if (!property || !property.listing) {
    notFound();
  }

  const isPublic =
    property.status === "AVAILABLE" && property.listing.status === "PUBLISHED";

  if (!isPublic) {
    notFound();
  }

  const amenities = JSON.parse(property.amenities || "[]") as string[];
  const bedroomLabel = property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bedrooms`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900/5">
          <Image
            src={property.images[0]?.url ?? "/images/properties/clerkenwell-1.svg"}
            alt={property.images[0]?.alt ?? property.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 3).map((image) => (
            <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl bg-ink-900/5">
              <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="30vw" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ink-900/50">
            {property.neighbourhood}, {property.city}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink-900">{property.listing.headline}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-900/70">{property.description}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-ink-900/10 bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-wide text-ink-900/50">Type</dt>
              <dd className="mt-1 text-sm font-medium">{propertyTypeLabel[property.propertyType]}</dd>
            </div>
            <div className="rounded-xl border border-ink-900/10 bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-wide text-ink-900/50">Sleeps</dt>
              <dd className="mt-1 text-sm font-medium">{bedroomLabel}</dd>
            </div>
            <div className="rounded-xl border border-ink-900/10 bg-white/70 p-4">
              <dt className="text-xs uppercase tracking-wide text-ink-900/50">Bathrooms</dt>
              <dd className="mt-1 text-sm font-medium">{property.bathrooms}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-ink-900">Amenities</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {amenities.map((item) => (
                <li key={item}>
                  <Badge variant="muted">{item}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-ink-900/10 bg-white/80 p-6 shadow-sm">
          <p className="text-3xl font-semibold text-ink-900">
            {formatGbpFromPence(property.listing.monthlyRentPence)}
            <span className="text-base font-normal text-ink-900/55"> pcm</span>
          </p>
          <p className="mt-2 text-sm text-ink-900/65">
            Available from{" "}
            {property.listing.availableFrom
              ? formatUkDate(property.listing.availableFrom)
              : "soon"}
          </p>
          <p className="mt-1 text-sm text-ink-900/65">
            {property.addressLine1}, {property.postcode}
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/sign-in">
              <Button className="w-full">Enquire about this home</Button>
            </Link>
            <p className="text-xs text-ink-900/55">
              Approved tenants can send an enquiry after signing in. Enquiry workflow lands fully in
              Week 2.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
