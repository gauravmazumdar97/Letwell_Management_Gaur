import type { Prisma, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/db";

export type SearchParamsInput = {
  location?: string;
  minRent?: string;
  maxRent?: string;
  bedrooms?: string;
  propertyType?: string;
  sort?: string;
};

function parsePoundsToPence(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const pounds = Number(value);
  if (!Number.isFinite(pounds) || pounds < 0) return undefined;
  return Math.round(pounds * 100);
}

export function buildPublicListingWhere(params: SearchParamsInput): Prisma.ListingWhereInput {
  const location = params.location?.trim();
  const minRent = parsePoundsToPence(params.minRent);
  const maxRent = parsePoundsToPence(params.maxRent);
  const bedrooms = params.bedrooms ? Number(params.bedrooms) : undefined;
  const propertyType = params.propertyType as PropertyType | undefined;

  const propertyFilter: Prisma.PropertyWhereInput = {
    status: "AVAILABLE",
  };

  if (location) {
    propertyFilter.OR = [
      { city: { contains: location } },
      { neighbourhood: { contains: location } },
      { postcode: { contains: location } },
    ];
  }

  if (Number.isInteger(bedrooms) && bedrooms !== undefined && bedrooms >= 0) {
    propertyFilter.bedrooms = bedrooms >= 3 ? { gte: 3 } : bedrooms;
  }

  if (propertyType && ["FLAT", "HOUSE", "STUDIO", "MAISONETTE"].includes(propertyType)) {
    propertyFilter.propertyType = propertyType;
  }

  const where: Prisma.ListingWhereInput = {
    status: "PUBLISHED",
    property: propertyFilter,
  };

  if (minRent !== undefined || maxRent !== undefined) {
    where.monthlyRentPence = {};
    if (minRent !== undefined) where.monthlyRentPence.gte = minRent;
    if (maxRent !== undefined) where.monthlyRentPence.lte = maxRent;
  }

  return where;
}

export function buildPublicListingOrderBy(
  sort: string | undefined,
): Prisma.ListingOrderByWithRelationInput {
  if (sort === "rent_asc") return { monthlyRentPence: "asc" };
  if (sort === "rent_desc") return { monthlyRentPence: "desc" };
  return { publishedAt: "desc" };
}

export async function getPublicListings(params: SearchParamsInput) {
  return prisma.listing.findMany({
    where: buildPublicListingWhere(params),
    orderBy: buildPublicListingOrderBy(params.sort),
    include: {
      property: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
  });
}

export async function getFeaturedListings(limit = 3) {
  return prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      property: { status: "AVAILABLE" },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      property: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
  });
}
