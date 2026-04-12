export type AppRole = "Platform Owner" | "Brand Design Lead" | "Creative Tech" | "IT Admin" | "Finance Stakeholder" | "Team Member";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  brand: string;
  role: AppRole;
  productAccess: string[];
  lastActive: string;
  status: "active" | "inactive";
  initials: string;
}

export const rolePermissions: Record<AppRole, string[]> = {
  "Platform Owner": ["/dashboard", "/products", "/reports", "/access", "/licences", "/resources"],
  "Brand Design Lead": ["/dashboard", "/products", "/reports", "/resources"],
  "Creative Tech": ["/dashboard", "/products", "/resources"],
  "IT Admin": ["/dashboard", "/access", "/licences", "/resources"],
  "Finance Stakeholder": ["/dashboard", "/reports", "/licences", "/resources"],
  "Team Member": ["/dashboard", "/products", "/resources"],
};

export const currentUser: AppUser = {
  id: "user-1",
  name: "Brice",
  email: "martin.kjaer@bestseller.com",
  brand: "BESTSELLER Tech",
  role: "Platform Owner",
  productAccess: ["adobe-cc", "ai-studioone", "capture-one", "creative-force", "pantone", "weavy", "midjourney", "davinci"],
  lastActive: "2026-04-11",
  status: "active",
  initials: "B",
};

export const users: AppUser[] = [
  currentUser,
  { id: "user-2", name: "Emma Nielsen", email: "emma.nielsen@bestseller.com", brand: "JACK & JONES", role: "Brand Design Lead", productAccess: ["adobe-cc", "capture-one", "creative-force"], lastActive: "2026-04-11", status: "active", initials: "EN" },
  { id: "user-3", name: "Lars Pedersen", email: "lars.pedersen@bestseller.com", brand: "VERO MODA", role: "Creative Tech", productAccess: ["adobe-cc", "ai-studioone", "midjourney"], lastActive: "2026-04-10", status: "active", initials: "LP" },
  { id: "user-4", name: "Sofia Andersen", email: "sofia.andersen@bestseller.com", brand: "ONLY", role: "Brand Design Lead", productAccess: ["adobe-cc", "pantone", "creative-force"], lastActive: "2026-04-09", status: "active", initials: "SA" },
  { id: "user-5", name: "Mikkel Hansen", email: "mikkel.hansen@bestseller.com", brand: "BESTSELLER Tech", role: "IT Admin", productAccess: ["adobe-cc", "weavy", "davinci"], lastActive: "2026-04-11", status: "active", initials: "MH" },
  { id: "user-6", name: "Camilla Jensen", email: "camilla.jensen@bestseller.com", brand: "SELECTED", role: "Team Member", productAccess: ["adobe-cc", "capture-one"], lastActive: "2026-04-08", status: "active", initials: "CJ" },
  { id: "user-7", name: "Frederik Larsen", email: "frederik.larsen@bestseller.com", brand: "BESTSELLER Tech", role: "Finance Stakeholder", productAccess: [], lastActive: "2026-04-07", status: "active", initials: "FL" },
  { id: "user-8", name: "Anna Christensen", email: "anna.christensen@bestseller.com", brand: "JACK & JONES", role: "Team Member", productAccess: ["adobe-cc", "ai-studioone"], lastActive: "2026-04-10", status: "active", initials: "AC" },
  { id: "user-9", name: "Oliver Rasmussen", email: "oliver.rasmussen@bestseller.com", brand: "NAME IT", role: "Creative Tech", productAccess: ["adobe-cc", "midjourney", "weavy"], lastActive: "2026-04-06", status: "active", initials: "OR" },
  { id: "user-10", name: "Ida Madsen", email: "ida.madsen@bestseller.com", brand: "VERO MODA", role: "Brand Design Lead", productAccess: ["adobe-cc", "capture-one", "pantone"], lastActive: "2026-04-11", status: "active", initials: "IM" },
  { id: "user-11", name: "Magnus Eriksen", email: "magnus.eriksen@bestseller.com", brand: "BESTSELLER Tech", role: "Platform Owner", productAccess: ["adobe-cc", "ai-studioone", "davinci", "weavy"], lastActive: "2026-04-11", status: "active", initials: "ME" },
  { id: "user-12", name: "Liv Thomsen", email: "liv.thomsen@bestseller.com", brand: "ONLY", role: "Team Member", productAccess: ["adobe-cc"], lastActive: "2026-04-05", status: "active", initials: "LT" },
  { id: "user-13", name: "Jonas Olsen", email: "jonas.olsen@bestseller.com", brand: "SELECTED", role: "Creative Tech", productAccess: ["adobe-cc", "davinci", "midjourney"], lastActive: "2026-04-09", status: "active", initials: "JO" },
  { id: "user-14", name: "Freja Møller", email: "freja.moller@bestseller.com", brand: "JACK & JONES", role: "Team Member", productAccess: ["adobe-cc", "creative-force"], lastActive: "2026-04-04", status: "inactive", initials: "FM" },
  { id: "user-15", name: "Rasmus Sørensen", email: "rasmus.sorensen@bestseller.com", brand: "BESTSELLER Tech", role: "IT Admin", productAccess: ["adobe-cc", "weavy", "ai-studioone"], lastActive: "2026-04-11", status: "active", initials: "RS" },
  { id: "user-16", name: "Clara Poulsen", email: "clara.poulsen@bestseller.com", brand: "VERO MODA", role: "Brand Design Lead", productAccess: ["adobe-cc", "capture-one", "creative-force", "pantone"], lastActive: "2026-04-10", status: "active", initials: "CP" },
  { id: "user-17", name: "Viktor Holm", email: "viktor.holm@bestseller.com", brand: "NAME IT", role: "Team Member", productAccess: ["adobe-cc", "ai-studioone"], lastActive: "2026-04-03", status: "inactive", initials: "VH" },
  { id: "user-18", name: "Nora Berg", email: "nora.berg@bestseller.com", brand: "ONLY", role: "Creative Tech", productAccess: ["adobe-cc", "midjourney", "davinci"], lastActive: "2026-04-08", status: "active", initials: "NB" },
  { id: "user-19", name: "Tobias Lund", email: "tobias.lund@bestseller.com", brand: "SELECTED", role: "Team Member", productAccess: ["adobe-cc", "creative-force"], lastActive: "2026-04-07", status: "active", initials: "TL" },
  { id: "user-20", name: "Astrid Dahl", email: "astrid.dahl@bestseller.com", brand: "BESTSELLER Tech", role: "Platform Owner", productAccess: ["adobe-cc", "ai-studioone", "weavy", "capture-one", "creative-force"], lastActive: "2026-04-11", status: "active", initials: "AD" },
];

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  roleRequested: string;
  brand: string;
  submittedDate: string;
}

export const accessRequests: AccessRequest[] = [
  { id: "req-1", userId: "user-6", userName: "Camilla Jensen", productId: "midjourney", productName: "Midjourney AI", roleRequested: "Designer", brand: "SELECTED", submittedDate: "2026-04-09" },
  { id: "req-2", userId: "user-12", userName: "Liv Thomsen", productId: "ai-studioone", productName: "BESTSELLER AI StudioOne", roleRequested: "Editor", brand: "ONLY", submittedDate: "2026-04-10" },
  { id: "req-3", userId: "user-17", userName: "Viktor Holm", productId: "weavy", productName: "Weavy AI", roleRequested: "Team Member", brand: "NAME IT", submittedDate: "2026-04-11" },
];
