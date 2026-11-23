import { Router } from "express";
import { z } from "zod";
import type { Prisma, PricingUnit } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/errors.js";

export const propertiesRouter = Router();

const searchSchema = z.object({
  location: z.string().optional(),
  category: z.string().optional(),
  pricingUnit: z.enum(["MONTHLY", "DAILY", "NIGHTLY", "EVENT"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
});

propertiesRouter.get("/properties", async (req, res, next) => {
  try {
    const query = searchSchema.parse(req.query);
    const where: Prisma.PropertyWhereInput = {
      status: "APPROVED",
      manager: { status: "APPROVED" },
    };

    if (query.location) {
      // MySQL utf8mb4_unicode_ci makes contains case-insensitive without Postgres mode.
      where.OR = [
        { city: { contains: query.location } },
        { neighbourhood: { contains: query.location } },
        { postcode: { contains: query.location } },
      ];
    }
    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.pricingUnit) {
      where.pricingUnit = query.pricingUnit as PricingUnit;
    }
    if (query.minPrice != null || query.maxPrice != null) {
      where.pricePence = {};
      if (query.minPrice != null) where.pricePence.gte = Math.round(query.minPrice * 100);
      if (query.maxPrice != null) where.pricePence.lte = Math.round(query.maxPrice * 100);
    }

    const orderBy: Prisma.PropertyOrderByWithRelationInput =
      query.sort === "price_asc"
        ? { pricePence: "asc" }
        : query.sort === "price_desc"
          ? { pricePence: "desc" }
          : { createdAt: "desc" };

    const properties = await prisma.property.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    res.json({
      items: properties.map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
        neighbourhood: p.neighbourhood,
        pricingUnit: p.pricingUnit,
        pricePence: p.pricePence,
        bedrooms: p.bedrooms,
        category: p.category?.name ?? null,
        image: p.images[0] ?? null,
      })),
    });
  } catch (error) {
    next(error);
  }
});

propertiesRouter.get("/properties/:id", async (req, res, next) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        manager: { select: { id: true, name: true, status: true } },
      },
    });
    if (!property || property.status !== "APPROVED" || property.manager.status !== "APPROVED") {
      throw new HttpError(404, "Property not found");
    }
    res.json({
      id: property.id,
      title: property.title,
      description: property.description,
      addressLine1: property.addressLine1,
      city: property.city,
      postcode: property.postcode,
      neighbourhood: property.neighbourhood,
      pricingUnit: property.pricingUnit,
      pricePence: property.pricePence,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: JSON.parse(property.amenitiesJson || "[]"),
      category: property.category,
      images: property.images,
    });
  } catch (error) {
    next(error);
  }
});
