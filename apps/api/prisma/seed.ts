import {
  AccountStatus,
  PricingUnit,
  PropertyStatus,
  PrismaClient,
  Role,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const PASSWORD = "Password123!";

async function upsertUser(input: {
  email: string;
  name: string;
  status: AccountStatus;
  roles: Role[];
  phone?: string;
}) {
  const passwordHash = await hash(PASSWORD, 10);
  const email = input.email.toLowerCase();
  return prisma.user.upsert({
    where: { email },
    update: {
      name: input.name,
      status: input.status,
      phone: input.phone,
      passwordHash,
      roles: {
        deleteMany: {},
        create: input.roles.map((role) => ({ role })),
      },
    },
    create: {
      email,
      name: input.name,
      status: input.status,
      phone: input.phone,
      passwordHash,
      roles: {
        create: input.roles.map((role) => ({ role })),
      },
    },
  });
}

async function main(): Promise<void> {
  await prisma.platformSettings.upsert({
    where: { id: "default" },
    update: { platformFeeBps: 1000 },
    create: { id: "default", platformFeeBps: 1000 },
  });

  const admin = await upsertUser({
    email: "admin@letwell.test",
    name: "Amelia Hart",
    status: "APPROVED",
    roles: ["ADMIN"],
    phone: "020 7946 0001",
  });

  const manager = await upsertUser({
    email: "manager.north@letwell.test",
    name: "Noah Whitfield",
    status: "APPROVED",
    roles: ["MANAGER"],
    phone: "020 7946 0101",
  });

  const dual = await upsertUser({
    email: "dual@letwell.test",
    name: "Jordan Ellis",
    status: "APPROVED",
    roles: ["TENANT", "MANAGER"],
  });

  const tenant = await upsertUser({
    email: "tenant.active@letwell.test",
    name: "James Okonkwo",
    status: "APPROVED",
    roles: ["TENANT"],
  });

  await upsertUser({
    email: "tenant.pending@letwell.test",
    name: "Callum Reid",
    status: "PENDING",
    roles: ["TENANT"],
  });

  await upsertUser({
    email: "tenant.suspended@letwell.test",
    name: "Hannah Cole",
    status: "SUSPENDED",
    roles: ["TENANT"],
  });

  await prisma.managerApplication.upsert({
    where: { userId: dual.id },
    update: { status: "APPROVED", message: "Experienced host with two London flats.", reviewedAt: new Date(), reviewedById: admin.id },
    create: {
      userId: dual.id,
      status: "APPROVED",
      message: "Experienced host with two London flats.",
      reviewedAt: new Date(),
      reviewedById: admin.id,
    },
  });

  const flats = await prisma.category.upsert({
    where: { slug: "flats" },
    update: { name: "Flats", active: true },
    create: { name: "Flats", slug: "flats", description: "Self-contained flats and apartments" },
  });
  const houses = await prisma.category.upsert({
    where: { slug: "houses" },
    update: { name: "Houses", active: true },
    create: { name: "Houses", slug: "houses", description: "Family houses and terraces" },
  });

  await prisma.worker.upsert({
    where: { email: "worker.plumbing@letwell.test" },
    update: { name: "Ellie Parks", trade: "Plumbing", active: true },
    create: {
      email: "worker.plumbing@letwell.test",
      name: "Ellie Parks",
      trade: "Plumbing",
      phone: "07700 900101",
      active: true,
    },
  });

  await prisma.paymentAttempt.deleteMany();
  await prisma.earning.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.maintenanceStatusHistory.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: flats.id,
      title: "Bright one-bed near Exmouth Market",
      description:
        "A calm Clerkenwell flat with tall windows, a renovated kitchen and a short walk to Farringdon.",
      addressLine1: "14 Northampton Road",
      city: "London",
      postcode: "EC1R 0HD",
      neighbourhood: "Clerkenwell",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 215000,
      bedrooms: 1,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["Courtyard", "Dishwasher", "Fibre broadband"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/clerkenwell-living.jpg",
            alt: "Sunlit living room with tall windows and pale oak floors",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/clerkenwell-kitchen.jpg",
            alt: "Contemporary kitchen with marble worktops and pendant lights",
            sortOrder: 1,
            storage: "local",
          },
          {
            url: "/images/properties/clerkenwell-bedroom.jpg",
            alt: "Calm bedroom with soft linen bedding and natural light",
            sortOrder: 2,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: flats.id,
      title: "Shoreditch studio loft",
      description: "Open-plan studio with exposed brick and mezzanine sleeping space.",
      addressLine1: "8 Ezra Street",
      city: "London",
      postcode: "E2 7RH",
      neighbourhood: "Shoreditch",
      pricingUnit: PricingUnit.NIGHTLY,
      pricePence: 14500,
      bedrooms: 0,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["Exposed brick", "Washer dryer"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/shoreditch-loft.jpg",
            alt: "Industrial loft with exposed brick and steel beams",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/shoreditch-living.jpg",
            alt: "Open-plan loft living space with large windows",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: houses.id,
      title: "Victorian terrace near Balham High Road",
      description:
        "A three-bedroom terrace with original floorboards, a south-facing garden and a renovated family bathroom.",
      addressLine1: "52 Bellevue Road",
      city: "London",
      postcode: "SW17 7EF",
      neighbourhood: "Balham",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 385000,
      bedrooms: 3,
      bathrooms: 2,
      amenitiesJson: JSON.stringify(["Private garden", "Period features", "Utility room"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/balham-house.jpg",
            alt: "Victorian terrace house exterior with warm brick facade",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/balham-living.jpg",
            alt: "Spacious family living room with sofa and soft lighting",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: dual.id,
      categoryId: flats.id,
      title: "Canal-side maisonette in Hackney Wick",
      description:
        "A light-filled two-bed above the towpath with floor-to-ceiling glass and a shared roof terrace.",
      addressLine1: "3 Wallis Road",
      city: "London",
      postcode: "E9 5LN",
      neighbourhood: "Hackney Wick",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 245000,
      bedrooms: 2,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["Canal views", "Roof terrace", "Bike store"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/hackney-canal.jpg",
            alt: "Bright apartment interior with floor-to-ceiling windows",
            sortOrder: 0,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: flats.id,
      title: "Islington garden flat near Upper Street",
      description:
        "A furnished one-bed with soft neutrals, a quiet rear courtyard and a five-minute walk to Angel.",
      addressLine1: "27 Cross Street",
      city: "London",
      postcode: "N1 2BB",
      neighbourhood: "Islington",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 228000,
      bedrooms: 1,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["Courtyard", "Furnished", "Washer dryer"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/islington-flat.jpg",
            alt: "Furnished Islington flat with soft seating and warm light",
            sortOrder: 0,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: flats.id,
      title: "Notting Hill bay-window flat",
      description:
        "A refined two-bed with tall bay windows, a marble kitchen and pastel stucco streets outside.",
      addressLine1: "11 Chepstow Villas",
      city: "London",
      postcode: "W11 3EE",
      neighbourhood: "Notting Hill",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 425000,
      bedrooms: 2,
      bathrooms: 2,
      amenitiesJson: JSON.stringify(["Bay windows", "Dishwasher", "Porter"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/notting-hill-living.jpg",
            alt: "Bright living room with large windows and modern furnishings",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/notting-hill-kitchen.jpg",
            alt: "Styled kitchen with marble surfaces and pendant lighting",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: houses.id,
      title: "Greenwich new-build with garden",
      description:
        "A contemporary three-bed near Greenwich Park with open living space and a private patio garden.",
      addressLine1: "4 Vanbrugh Hill",
      city: "London",
      postcode: "SE3 7UF",
      neighbourhood: "Greenwich",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 410000,
      bedrooms: 3,
      bathrooms: 2,
      amenitiesJson: JSON.stringify(["Private garden", "Parking", "Underfloor heating"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/greenwich-exterior.jpg",
            alt: "Modern house exterior with clean lines and landscaped frontage",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/greenwich-living.jpg",
            alt: "Open living room with sofa and abundant natural light",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: dual.id,
      categoryId: flats.id,
      title: "Camden warehouse conversion",
      description:
        "A dramatic loft near Camden Lock with double-height ceilings, a mezzanine desk and nightlife on the doorstep.",
      addressLine1: "19 Oval Road",
      city: "London",
      postcode: "NW1 7EA",
      neighbourhood: "Camden",
      pricingUnit: PricingUnit.NIGHTLY,
      pricePence: 16500,
      bedrooms: 1,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["High ceilings", "Workspace", "Washer dryer"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/camden-loft.jpg",
            alt: "Warehouse loft living space with tall windows",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/camden-bedroom.jpg",
            alt: "Calm bedroom with layered textiles and soft lighting",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: houses.id,
      title: "Richmond riverside family home",
      description:
        "A four-bed home near Richmond Green with a landscaped garden, open kitchen and easy Heathrow links.",
      addressLine1: "8 The Vineyard",
      city: "London",
      postcode: "TW10 6AQ",
      neighbourhood: "Richmond",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 575000,
      bedrooms: 4,
      bathrooms: 3,
      amenitiesJson: JSON.stringify(["Large garden", "Driveway", "Study"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/richmond-garden.jpg",
            alt: "Premium family home exterior with garden outlook",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/richmond-interior.jpg",
            alt: "Elegant interior with open living and dining space",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: dual.id,
      categoryId: flats.id,
      title: "Wapping riverside apartment",
      description:
        "A polished two-bed overlooking the Thames with a chef's kitchen and evening river light.",
      addressLine1: "22 Hermitage Wall",
      city: "London",
      postcode: "E1W 1LW",
      neighbourhood: "Wapping",
      pricingUnit: PricingUnit.MONTHLY,
      pricePence: 365000,
      bedrooms: 2,
      bathrooms: 2,
      amenitiesJson: JSON.stringify(["River views", "Concierge", "Gym"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/wapping-river.jpg",
            alt: "Stylish apartment living area with city light",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/wapping-kitchen.jpg",
            alt: "Bright kitchen with dining table and open shelves",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      managerId: manager.id,
      categoryId: flats.id,
      title: "Kensington townhouse suite",
      description:
        "A boutique one-bed suite with layered textures, a dressing room and museums a short stroll away.",
      addressLine1: "5 Lexham Gardens",
      city: "London",
      postcode: "W8 5JJ",
      neighbourhood: "Kensington",
      pricingUnit: PricingUnit.DAILY,
      pricePence: 28000,
      bedrooms: 1,
      bathrooms: 1,
      amenitiesJson: JSON.stringify(["Dressing room", "Housekeeping", "Doorman"]),
      status: PropertyStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          {
            url: "/images/properties/kensington-living.jpg",
            alt: "Luxury living room with sculptural lighting and soft neutrals",
            sortOrder: 0,
            storage: "local",
          },
          {
            url: "/images/properties/kensington-bedroom.jpg",
            alt: "Boutique bedroom with layered bedding and calm tones",
            sortOrder: 1,
            storage: "local",
          },
        ],
      },
    },
  });

  void tenant;
  console.log("Seed complete. Shared password:", PASSWORD);
  console.log("Accounts: admin@letwell.test, manager.north@letwell.test, tenant.active@letwell.test, dual@letwell.test");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
