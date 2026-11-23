import type {
  AccountStatus,
  ListingStatus,
  MaintenanceStatus,
  PropertyStatus,
  PropertyType,
  Role,
} from "@prisma/client";

export const roleLabel: Record<Role, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

export const accountStatusLabel: Record<AccountStatus, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export const propertyTypeLabel: Record<PropertyType, string> = {
  FLAT: "Flat",
  HOUSE: "House",
  STUDIO: "Studio",
  MAISONETTE: "Maisonette",
};

export const propertyStatusLabel: Record<PropertyStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  UNAVAILABLE: "Unavailable",
};

export const listingStatusLabel: Record<ListingStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const maintenanceStatusLabel: Record<MaintenanceStatus, string> = {
  SUBMITTED: "Submitted",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

/** Allowed maintenance transitions (Week 4 enforces on writes). */
export const maintenanceTransitions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  SUBMITTED: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
};
