import Image from "next/image";
import Link from "next/link";
import { formatGbpFromPence } from "@/lib/money";
import { propertyTypeLabel } from "@/lib/labels";
import type { PropertyType } from "@prisma/client";

type PropertyCardProps = {
  id: string;
  headline: string;
  neighbourhood: string;
  city: string;
  monthlyRentPence: number;
  bedrooms: number;
  propertyType: PropertyType;
  imageUrl: string;
  imageAlt: string;
};

export function PropertyCard({
  id,
  headline,
  neighbourhood,
  city,
  monthlyRentPence,
  bedrooms,
  propertyType,
  imageUrl,
  imageAlt,
}: PropertyCardProps) {
  const bedroomLabel = bedrooms === 0 ? "Studio" : `${bedrooms} bed`;

  return (
    <article className="group">
      <Link href={`/properties/${id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-900/5">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-lg font-semibold text-ink-900">{formatGbpFromPence(monthlyRentPence)} pcm</p>
          <h3 className="text-base text-ink-900">{headline}</h3>
          <p className="text-sm text-ink-900/60">
            {neighbourhood}, {city} · {bedroomLabel} · {propertyTypeLabel[propertyType]}
          </p>
        </div>
      </Link>
    </article>
  );
}
