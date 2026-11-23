import {
  AccountStatus,
  ListingStatus,
  MaintenanceStatus,
  PrismaClient,
  PropertyStatus,
  PropertyType,
  Role,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "Password123!";

async function upsertUser(input: {
  email: string;
  name: string;
  role: Role;
  status: AccountStatus;
  phone?: string;
}) {
  const passwordHash = await hash(PASSWORD, 10);
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      role: input.role,
      status: input.status,
      phone: input.phone,
      passwordHash,
    },
    create: {
      email: input.email,
      name: input.name,
      role: input.role,
      status: input.status,
      phone: input.phone,
      passwordHash,
    },
  });
}

async function main(): Promise<void> {
  const admin = await upsertUser({
    email: "admin@letwell.test",
    name: "Amelia Hart",
    role: "ADMIN",
    status: "APPROVED",
    phone: "020 7946 0001",
  });

  const landlordA = await upsertUser({
    email: "landlord.north@letwell.test",
    name: "Noah Whitfield",
    role: "LANDLORD",
    status: "APPROVED",
    phone: "020 7946 0101",
  });

  const landlordB = await upsertUser({
    email: "landlord.south@letwell.test",
    name: "Sofia Meridian",
    role: "LANDLORD",
    status: "APPROVED",
    phone: "020 7946 0102",
  });

  const tenantActive = await upsertUser({
    email: "tenant.active@letwell.test",
    name: "James Okonkwo",
    role: "TENANT",
    status: "APPROVED",
    phone: "07123 456701",
  });

  const tenantFree = await upsertUser({
    email: "tenant.free@letwell.test",
    name: "Priya Shah",
    role: "TENANT",
    status: "APPROVED",
    phone: "07123 456702",
  });

  await upsertUser({
    email: "tenant.pending@letwell.test",
    name: "Callum Reid",
    role: "TENANT",
    status: "PENDING",
    phone: "07123 456703",
  });

  await upsertUser({
    email: "tenant.suspended@letwell.test",
    name: "Hannah Cole",
    role: "TENANT",
    status: "SUSPENDED",
    phone: "07123 456704",
  });

  await upsertUser({
    email: "landlord.pending@letwell.test",
    name: "Marcus Bell",
    role: "LANDLORD",
    status: "PENDING",
  });

  const plumber = await prisma.worker.upsert({
    where: { email: "worker.plumbing@letwell.test" },
    update: { name: "Ellie Parks", trade: "Plumbing", active: true, phone: "07700 900101" },
    create: {
      email: "worker.plumbing@letwell.test",
      name: "Ellie Parks",
      trade: "Plumbing",
      phone: "07700 900101",
      active: true,
    },
  });

  await prisma.worker.upsert({
    where: { email: "worker.electrical@letwell.test" },
    update: { name: "Tom Reeve", trade: "Electrical", active: true, phone: "07700 900102" },
    create: {
      email: "worker.electrical@letwell.test",
      name: "Tom Reeve",
      trade: "Electrical",
      phone: "07700 900102",
      active: true,
    },
  });

  await prisma.payment.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.rentCharge.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.maintenanceStatusHistory.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.property.deleteMany();

  const flatClerkenwell = await prisma.property.create({
    data: {
      landlordId: landlordA.id,
      title: "Bright one-bed near Exmouth Market",
      description:
        "A calm Clerkenwell flat with tall windows, a renovated kitchen and a short walk to Farringdon. Ideal for a professional couple seeking a quiet courtyard setting.",
      addressLine1: "14 Northampton Road",
      city: "London",
      postcode: "EC1R 0HD",
      neighbourhood: "Clerkenwell",
      propertyType: PropertyType.FLAT,
      bedrooms: 1,
      bathrooms: 1,
      furnished: true,
      amenities: JSON.stringify(["Courtyard", "Dishwasher", "Fibre broadband", "Bike store"]),
      status: PropertyStatus.AVAILABLE,
      images: {
        create: [
          {
            url: "/images/properties/clerkenwell-1.svg",
            alt: "Living room with tall windows overlooking a courtyard",
            sortOrder: 0,
          },
          {
            url: "/images/properties/clerkenwell-2.svg",
            alt: "Compact kitchen with oak worktops",
            sortOrder: 1,
          },
        ],
      },
      listing: {
        create: {
          status: ListingStatus.PUBLISHED,
          headline: "Clerkenwell one-bed with courtyard calm",
          monthlyRentPence: 215000,
          availableFrom: new Date("2026-12-01"),
          publishedAt: new Date("2026-11-01"),
        },
      },
    },
  });

  const houseBalham = await prisma.property.create({
    data: {
      landlordId: landlordB.id,
      title: "Victorian terrace near Balham High Road",
      description:
        "A three-bedroom terrace with original floorboards, a south-facing garden and a renovated family bathroom. Moments from Balham station and local cafes.",
      addressLine1: "52 Bellevue Road",
      city: "London",
      postcode: "SW17 7EF",
      neighbourhood: "Balham",
      propertyType: PropertyType.HOUSE,
      bedrooms: 3,
      bathrooms: 2,
      furnished: false,
      amenities: JSON.stringify(["Private garden", "Period features", "Utility room", "Off-street parking"]),
      status: PropertyStatus.AVAILABLE,
      images: {
        create: [
          {
            url: "/images/properties/balham-1.svg",
            alt: "Front elevation of a Victorian terrace house",
            sortOrder: 0,
          },
        ],
      },
      listing: {
        create: {
          status: ListingStatus.PUBLISHED,
          headline: "Family terrace with a sunny Balham garden",
          monthlyRentPence: 385000,
          availableFrom: new Date("2026-11-20"),
          publishedAt: new Date("2026-10-15"),
        },
      },
    },
  });

  const studioShoreditch = await prisma.property.create({
    data: {
      landlordId: landlordA.id,
      title: "Studio loft above Columbia Road",
      description:
        "An open-plan studio with exposed brick, mezzanine sleeping space and excellent natural light. Perfect for a solo renter who wants Shoreditch on the doorstep.",
      addressLine1: "8 Ezra Street",
      city: "London",
      postcode: "E2 7RH",
      neighbourhood: "Shoreditch",
      propertyType: PropertyType.STUDIO,
      bedrooms: 0,
      bathrooms: 1,
      furnished: true,
      amenities: JSON.stringify(["Exposed brick", "Mezzanine bed", "Washer dryer"]),
      status: PropertyStatus.AVAILABLE,
      images: {
        create: [
          {
            url: "/images/properties/shoreditch-1.svg",
            alt: "Open-plan studio with exposed brick wall",
            sortOrder: 0,
          },
        ],
      },
      listing: {
        create: {
          status: ListingStatus.PUBLISHED,
          headline: "Shoreditch studio loft with mezzanine",
          monthlyRentPence: 165000,
          availableFrom: new Date("2026-11-28"),
          publishedAt: new Date("2026-11-05"),
        },
      },
    },
  });

  const draftHackney = await prisma.property.create({
    data: {
      landlordId: landlordB.id,
      title: "Canal-side maisonette in Hackney Wick",
      description: "Draft listing awaiting photography and final copy.",
      addressLine1: "3 Wallis Road",
      city: "London",
      postcode: "E9 5LN",
      neighbourhood: "Hackney Wick",
      propertyType: PropertyType.MAISONETTE,
      bedrooms: 2,
      bathrooms: 1,
      furnished: false,
      amenities: JSON.stringify(["Canal views", "Roof terrace"]),
      status: PropertyStatus.AVAILABLE,
      images: {
        create: [
          {
            url: "/images/properties/hackney-1.svg",
            alt: "Canal-side exterior of a maisonette",
            sortOrder: 0,
          },
        ],
      },
      listing: {
        create: {
          status: ListingStatus.DRAFT,
          headline: "Hackney Wick maisonette (draft)",
          monthlyRentPence: 245000,
        },
      },
    },
  });

  const occupiedIslington = await prisma.property.create({
    data: {
      landlordId: landlordA.id,
      title: "Two-bed garden flat in Barnsbury",
      description:
        "A quiet Islington flat currently let. Retained in seed data to demonstrate occupancy and rent workflows.",
      addressLine1: "19 Richmond Avenue",
      city: "London",
      postcode: "N1 0NE",
      neighbourhood: "Islington",
      propertyType: PropertyType.FLAT,
      bedrooms: 2,
      bathrooms: 1,
      furnished: true,
      amenities: JSON.stringify(["Shared garden", "Fitted wardrobes", "Quiet street"]),
      status: PropertyStatus.OCCUPIED,
      images: {
        create: [
          {
            url: "/images/properties/islington-1.svg",
            alt: "Sitting room of an Islington garden flat",
            sortOrder: 0,
          },
        ],
      },
      listing: {
        create: {
          status: ListingStatus.ARCHIVED,
          headline: "Barnsbury two-bed garden flat",
          monthlyRentPence: 275000,
          archivedAt: new Date("2026-09-01"),
        },
      },
    },
  });

  const lease = await prisma.lease.create({
    data: {
      propertyId: occupiedIslington.id,
      tenantId: tenantActive.id,
      status: "ACTIVE",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      monthlyRentPence: 275000,
      dueDay: 1,
      activatedAt: new Date("2026-09-01"),
    },
  });

  const overdueDue = new Date();
  overdueDue.setDate(overdueDue.getDate() - 12);
  overdueDue.setHours(12, 0, 0, 0);

  await prisma.rentCharge.create({
    data: {
      leaseId: lease.id,
      periodYear: overdueDue.getFullYear(),
      periodMonth: overdueDue.getMonth() + 1,
      dueDate: overdueDue,
      amountPence: 275000,
      status: "OVERDUE",
    },
  });

  const paidDue = new Date();
  paidDue.setMonth(paidDue.getMonth() - 1);
  paidDue.setDate(1);
  paidDue.setHours(12, 0, 0, 0);

  const paidCharge = await prisma.rentCharge.create({
    data: {
      leaseId: lease.id,
      periodYear: paidDue.getFullYear(),
      periodMonth: paidDue.getMonth() + 1,
      dueDate: paidDue,
      amountPence: 275000,
      status: "PAID",
      payment: {
        create: {
          amountPence: 275000,
          paidAt: new Date(paidDue.getTime() + 2 * 24 * 60 * 60 * 1000),
          methodLabel: "Demo payment",
          receiptRef: "LW-RCPT-SEED-001",
        },
      },
    },
  });

  const request = await prisma.maintenanceRequest.create({
    data: {
      leaseId: lease.id,
      propertyId: occupiedIslington.id,
      tenantId: tenantActive.id,
      workerId: plumber.id,
      title: "Kitchen tap dripping",
      description: "The mixer tap drips steadily overnight and has stained the sink.",
      category: "PLUMBING",
      urgency: "MEDIUM",
      status: MaintenanceStatus.ASSIGNED,
      history: {
        create: [
          {
            fromStatus: null,
            toStatus: MaintenanceStatus.SUBMITTED,
            note: "Request submitted by tenant",
            actorUserId: tenantActive.id,
          },
          {
            fromStatus: MaintenanceStatus.SUBMITTED,
            toStatus: MaintenanceStatus.ASSIGNED,
            note: "Assigned to Ellie Parks",
            actorUserId: admin.id,
          },
        ],
      },
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      leaseId: lease.id,
      propertyId: occupiedIslington.id,
      tenantId: tenantActive.id,
      title: "Extractor fan noisy",
      description: "Bathroom extractor rattles loudly on start-up.",
      category: "ELECTRICAL",
      urgency: "LOW",
      status: MaintenanceStatus.SUBMITTED,
      history: {
        create: [
          {
            fromStatus: null,
            toStatus: MaintenanceStatus.SUBMITTED,
            note: "Request submitted by tenant",
            actorUserId: tenantActive.id,
          },
        ],
      },
    },
  });

  void flatClerkenwell;
  void houseBalham;
  void studioShoreditch;
  void draftHackney;
  void paidCharge;
  void request;
  void tenantFree;

  console.log("Seed complete.");
  console.log("Shared password for all seeded accounts:", PASSWORD);
  console.log("Roles: admin@letwell.test, landlord.north@letwell.test, tenant.active@letwell.test");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
