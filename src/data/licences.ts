import { products } from "./products";

export interface LicenceRegisterEntry {
  productId: string;
  productName: string;
  totalSeats: number;
  utilisation: number;
  costMonthly: number;
  costAnnual: number;
  renewalDate: string | null;
  status: string;
}

export const licenceRegister: LicenceRegisterEntry[] = products.map(p => ({
  productId: p.id,
  productName: p.name,
  totalSeats: p.seats,
  utilisation: p.utilisation,
  costMonthly: p.costMonthly,
  costAnnual: p.costMonthly * 12,
  renewalDate: p.renewal,
  status: p.status,
}));

export interface UnusedSeat {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  lastActiveDaysAgo: number;
  costPerSeat: number;
}

export const unusedSeats: UnusedSeat[] = [
  { id: "us-1", productId: "adobe-cc", productName: "Adobe Creative Cloud Suite", userName: "Freja Møller", lastActiveDaysAgo: 162, costPerSeat: 65 },
  { id: "us-2", productId: "creative-force", productName: "Creative Force", userName: "Viktor Holm", lastActiveDaysAgo: 98, costPerSeat: 57 },
  { id: "us-3", productId: "weavy", productName: "Weavy AI", userName: "Tobias Lund", lastActiveDaysAgo: 45, costPerSeat: 27 },
  { id: "us-4", productId: "capture-one", productName: "Capture One Studio", userName: "Liv Thomsen", lastActiveDaysAgo: 72, costPerSeat: 50 },
  { id: "us-5", productId: "pantone", productName: "Pantone Connect", userName: "Jonas Olsen", lastActiveDaysAgo: 31, costPerSeat: 22 },
];
