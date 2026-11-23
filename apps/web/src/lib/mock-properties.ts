export type MockProperty = {
  id: string;
  title: string;
  description: string;
  addressLine1: string;
  city: string;
  postcode: string;
  neighbourhood: string;
  pricingUnit: "MONTHLY" | "DAILY" | "NIGHTLY" | "EVENT";
  pricePence: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  category: string;
  createdAt: string;
  images: { id: string; url: string; alt: string }[];
};

/** Seed-aligned demo listings for frontend-only deploys. */
export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: "demo-clerkenwell",
    title: "Bright one-bed near Exmouth Market",
    description:
      "A calm Clerkenwell flat with tall windows, a renovated kitchen and a short walk to Farringdon.",
    addressLine1: "14 Northampton Road",
    city: "London",
    postcode: "EC1R 0HD",
    neighbourhood: "Clerkenwell",
    pricingUnit: "MONTHLY",
    pricePence: 215000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Courtyard", "Dishwasher", "Fibre broadband"],
    category: "Flats",
    createdAt: "2026-11-20T10:00:00.000Z",
    images: [
      {
        id: "demo-clerkenwell-1",
        url: "/images/properties/clerkenwell-living.jpg",
        alt: "Sunlit living room with tall windows and pale oak floors",
      },
      {
        id: "demo-clerkenwell-2",
        url: "/images/properties/clerkenwell-kitchen.jpg",
        alt: "Contemporary kitchen with marble worktops and pendant lights",
      },
      {
        id: "demo-clerkenwell-3",
        url: "/images/properties/clerkenwell-bedroom.jpg",
        alt: "Calm bedroom with soft linen bedding and natural light",
      },
    ],
  },
  {
    id: "demo-shoreditch",
    title: "Shoreditch studio loft",
    description: "Open-plan studio with exposed brick and mezzanine sleeping space.",
    addressLine1: "8 Ezra Street",
    city: "London",
    postcode: "E2 7RH",
    neighbourhood: "Shoreditch",
    pricingUnit: "NIGHTLY",
    pricePence: 14500,
    bedrooms: 0,
    bathrooms: 1,
    amenities: ["Exposed brick", "Washer dryer"],
    category: "Flats",
    createdAt: "2026-11-19T10:00:00.000Z",
    images: [
      {
        id: "demo-shoreditch-1",
        url: "/images/properties/shoreditch-loft.jpg",
        alt: "Industrial loft with exposed brick and steel beams",
      },
      {
        id: "demo-shoreditch-2",
        url: "/images/properties/shoreditch-living.jpg",
        alt: "Open-plan loft living space with large windows",
      },
    ],
  },
  {
    id: "demo-balham",
    title: "Victorian terrace near Balham High Road",
    description:
      "A three-bedroom terrace with original floorboards, a south-facing garden and a renovated family bathroom.",
    addressLine1: "52 Bellevue Road",
    city: "London",
    postcode: "SW17 7EF",
    neighbourhood: "Balham",
    pricingUnit: "MONTHLY",
    pricePence: 385000,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Private garden", "Period features", "Utility room"],
    category: "Houses",
    createdAt: "2026-11-18T10:00:00.000Z",
    images: [
      {
        id: "demo-balham-1",
        url: "/images/properties/balham-house.jpg",
        alt: "Victorian terrace house exterior with warm brick facade",
      },
      {
        id: "demo-balham-2",
        url: "/images/properties/balham-living.jpg",
        alt: "Spacious family living room with sofa and soft lighting",
      },
    ],
  },
  {
    id: "demo-hackney",
    title: "Canal-side maisonette in Hackney Wick",
    description:
      "A light-filled two-bed above the towpath with floor-to-ceiling glass and a shared roof terrace.",
    addressLine1: "3 Wallis Road",
    city: "London",
    postcode: "E9 5LN",
    neighbourhood: "Hackney Wick",
    pricingUnit: "MONTHLY",
    pricePence: 245000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Canal views", "Roof terrace", "Bike store"],
    category: "Flats",
    createdAt: "2026-11-17T10:00:00.000Z",
    images: [
      {
        id: "demo-hackney-1",
        url: "/images/properties/hackney-canal.jpg",
        alt: "Bright apartment interior with floor-to-ceiling windows",
      },
    ],
  },
  {
    id: "demo-islington",
    title: "Islington garden flat near Upper Street",
    description:
      "A furnished one-bed with soft neutrals, a quiet rear courtyard and a five-minute walk to Angel.",
    addressLine1: "27 Cross Street",
    city: "London",
    postcode: "N1 2BB",
    neighbourhood: "Islington",
    pricingUnit: "MONTHLY",
    pricePence: 228000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Courtyard", "Furnished", "Washer dryer"],
    category: "Flats",
    createdAt: "2026-11-16T10:00:00.000Z",
    images: [
      {
        id: "demo-islington-1",
        url: "/images/properties/islington-flat.jpg",
        alt: "Furnished Islington flat with soft seating and warm light",
      },
    ],
  },
  {
    id: "demo-notting-hill",
    title: "Notting Hill bay-window flat",
    description:
      "A refined two-bed with tall bay windows, a marble kitchen and pastel stucco streets outside.",
    addressLine1: "11 Chepstow Villas",
    city: "London",
    postcode: "W11 3EE",
    neighbourhood: "Notting Hill",
    pricingUnit: "MONTHLY",
    pricePence: 425000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Bay windows", "Dishwasher", "Porter"],
    category: "Flats",
    createdAt: "2026-11-15T10:00:00.000Z",
    images: [
      {
        id: "demo-notting-hill-1",
        url: "/images/properties/notting-hill-living.jpg",
        alt: "Bright living room with large windows and modern furnishings",
      },
      {
        id: "demo-notting-hill-2",
        url: "/images/properties/notting-hill-kitchen.jpg",
        alt: "Styled kitchen with marble surfaces and pendant lighting",
      },
    ],
  },
  {
    id: "demo-greenwich",
    title: "Greenwich new-build with garden",
    description:
      "A contemporary three-bed near Greenwich Park with open living space and a private patio garden.",
    addressLine1: "4 Vanbrugh Hill",
    city: "London",
    postcode: "SE3 7UF",
    neighbourhood: "Greenwich",
    pricingUnit: "MONTHLY",
    pricePence: 410000,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Private garden", "Parking", "Underfloor heating"],
    category: "Houses",
    createdAt: "2026-11-14T10:00:00.000Z",
    images: [
      {
        id: "demo-greenwich-1",
        url: "/images/properties/greenwich-exterior.jpg",
        alt: "Modern house exterior with clean lines and landscaped frontage",
      },
      {
        id: "demo-greenwich-2",
        url: "/images/properties/greenwich-living.jpg",
        alt: "Open living room with sofa and abundant natural light",
      },
    ],
  },
  {
    id: "demo-camden",
    title: "Camden warehouse conversion",
    description:
      "A dramatic loft near Camden Lock with double-height ceilings, a mezzanine desk and nightlife on the doorstep.",
    addressLine1: "19 Oval Road",
    city: "London",
    postcode: "NW1 7EA",
    neighbourhood: "Camden",
    pricingUnit: "NIGHTLY",
    pricePence: 16500,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["High ceilings", "Workspace", "Washer dryer"],
    category: "Flats",
    createdAt: "2026-11-13T10:00:00.000Z",
    images: [
      {
        id: "demo-camden-1",
        url: "/images/properties/camden-loft.jpg",
        alt: "Warehouse loft living space with tall windows",
      },
      {
        id: "demo-camden-2",
        url: "/images/properties/camden-bedroom.jpg",
        alt: "Calm bedroom with layered textiles and soft lighting",
      },
    ],
  },
  {
    id: "demo-richmond",
    title: "Richmond riverside family home",
    description:
      "A four-bed home near Richmond Green with a landscaped garden, open kitchen and easy Heathrow links.",
    addressLine1: "8 The Vineyard",
    city: "London",
    postcode: "TW10 6AQ",
    neighbourhood: "Richmond",
    pricingUnit: "MONTHLY",
    pricePence: 575000,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Large garden", "Driveway", "Study"],
    category: "Houses",
    createdAt: "2026-11-12T10:00:00.000Z",
    images: [
      {
        id: "demo-richmond-1",
        url: "/images/properties/richmond-garden.jpg",
        alt: "Premium family home exterior with garden outlook",
      },
      {
        id: "demo-richmond-2",
        url: "/images/properties/richmond-interior.jpg",
        alt: "Elegant interior with open living and dining space",
      },
    ],
  },
  {
    id: "demo-wapping",
    title: "Wapping riverside apartment",
    description:
      "A polished two-bed overlooking the Thames with a chef's kitchen and evening river light.",
    addressLine1: "22 Hermitage Wall",
    city: "London",
    postcode: "E1W 1LW",
    neighbourhood: "Wapping",
    pricingUnit: "MONTHLY",
    pricePence: 365000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["River views", "Concierge", "Gym"],
    category: "Flats",
    createdAt: "2026-11-11T10:00:00.000Z",
    images: [
      {
        id: "demo-wapping-1",
        url: "/images/properties/wapping-river.jpg",
        alt: "Stylish apartment living area with city light",
      },
      {
        id: "demo-wapping-2",
        url: "/images/properties/wapping-kitchen.jpg",
        alt: "Bright kitchen with dining table and open shelves",
      },
    ],
  },
  {
    id: "demo-kensington",
    title: "Kensington townhouse suite",
    description:
      "A boutique one-bed suite with layered textures, a dressing room and museums a short stroll away.",
    addressLine1: "5 Lexham Gardens",
    city: "London",
    postcode: "W8 5JJ",
    neighbourhood: "Kensington",
    pricingUnit: "DAILY",
    pricePence: 28000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Dressing room", "Housekeeping", "Doorman"],
    category: "Flats",
    createdAt: "2026-11-10T10:00:00.000Z",
    images: [
      {
        id: "demo-kensington-1",
        url: "/images/properties/kensington-living.jpg",
        alt: "Luxury living room with sculptural lighting and soft neutrals",
      },
      {
        id: "demo-kensington-2",
        url: "/images/properties/kensington-bedroom.jpg",
        alt: "Boutique bedroom with layered bedding and calm tones",
      },
    ],
  },
];

export type PropertyListItem = {
  id: string;
  title: string;
  neighbourhood: string;
  city: string;
  pricePence: number;
  pricingUnit: string;
  bedrooms: number;
  category: string | null;
  image: { url: string; alt: string } | null;
};

function toListItem(property: MockProperty): PropertyListItem {
  const image = property.images[0];
  return {
    id: property.id,
    title: property.title,
    neighbourhood: property.neighbourhood,
    city: property.city,
    pricePence: property.pricePence,
    pricingUnit: property.pricingUnit,
    bedrooms: property.bedrooms,
    category: property.category,
    image: image ? { url: image.url, alt: image.alt } : null,
  };
}

function parseSearchParams(path: string): URLSearchParams {
  const queryIndex = path.indexOf("?");
  if (queryIndex < 0) return new URLSearchParams();
  return new URLSearchParams(path.slice(queryIndex + 1));
}

export function mockListProperties(path: string): { items: PropertyListItem[] } {
  const query = parseSearchParams(path);
  const location = query.get("location")?.trim().toLowerCase() ?? "";
  const pricingUnit = query.get("pricingUnit")?.trim().toUpperCase() ?? "";
  const category = query.get("category")?.trim().toLowerCase() ?? "";
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const sort = query.get("sort") ?? "newest";

  const minPence = minPrice ? Math.round(Number(minPrice) * 100) : null;
  const maxPence = maxPrice ? Math.round(Number(maxPrice) * 100) : null;

  let items = MOCK_PROPERTIES.filter((property) => {
    if (location) {
      const haystack = `${property.city} ${property.neighbourhood} ${property.postcode}`.toLowerCase();
      if (!haystack.includes(location)) return false;
    }
    if (pricingUnit && property.pricingUnit !== pricingUnit) return false;
    if (category && property.category.toLowerCase() !== category) return false;
    if (minPence != null && !Number.isNaN(minPence) && property.pricePence < minPence) return false;
    if (maxPence != null && !Number.isNaN(maxPence) && property.pricePence > maxPence) return false;
    return true;
  });

  items = [...items].sort((a, b) => {
    if (sort === "price_asc") return a.pricePence - b.pricePence;
    if (sort === "price_desc") return b.pricePence - a.pricePence;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return { items: items.map(toListItem) };
}

export function mockGetProperty(id: string): MockProperty | null {
  return MOCK_PROPERTIES.find((property) => property.id === id) ?? null;
}
