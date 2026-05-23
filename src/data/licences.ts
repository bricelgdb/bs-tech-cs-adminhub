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

// Static placeholder licence-register fixture (numbers mirror the seeded products
// in the database). The authoritative product data lives in the `products` table
// and is fetched via the authenticated client.
export const licenceRegister: LicenceRegisterEntry[] = [
  { productId: "ai-studioone", productName: "BESTSELLER AI Studio", totalSeats: 88, utilisation: 94, costMonthly: 0, costAnnual: 0, renewalDate: null, status: "active" },
  { productId: "adobe-cc", productName: "Adobe Creative Cloud Suite", totalSeats: 142, utilisation: 89, costMonthly: 9240, costAnnual: 110880, renewalDate: "2026-09-01", status: "active" },
  { productId: "capture-one", productName: "Capture One Studio", totalSeats: 37, utilisation: 81, costMonthly: 1840, costAnnual: 22080, renewalDate: "2026-08-01", status: "active" },
  { productId: "creative-force", productName: "Creative Force", totalSeats: 54, utilisation: 76, costMonthly: 3100, costAnnual: 37200, renewalDate: "2026-07-01", status: "active" },
  { productId: "pantone", productName: "Pantone Connect", totalSeats: 22, utilisation: 64, costMonthly: 480, costAnnual: 5760, renewalDate: "2026-04-28", status: "expiring" },
  { productId: "weavy", productName: "Weavy AI", totalSeats: 88, utilisation: 71, costMonthly: 2400, costAnnual: 28800, renewalDate: "2026-06-01", status: "active" },
  { productId: "midjourney", productName: "Midjourney AI", totalSeats: 12, utilisation: 100, costMonthly: 960, costAnnual: 11520, renewalDate: "2026-06-01", status: "active" },
  { productId: "davinci", productName: "DaVinci Resolve Studio", totalSeats: 20, utilisation: 85, costMonthly: 1600, costAnnual: 19200, renewalDate: "2026-05-03", status: "expiring" },
  { productId: "ipaper", productName: "iPaper", totalSeats: 18, utilisation: 72, costMonthly: 720, costAnnual: 8640, renewalDate: "2026-10-01", status: "active" },
  { productId: "fonts", productName: "Fonts", totalSeats: 65, utilisation: 80, costMonthly: 540, costAnnual: 6480, renewalDate: "2026-12-01", status: "active" },
];

export interface UnusedSeat {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  lastActiveDaysAgo: number;
  costPerSeat: number;
}

export const unusedSeats: UnusedSeat[] = [
  { id: "us-1", productId: "adobe-cc", productName: "Adobe Creative Cloud Suite", userName: "User 1", lastActiveDaysAgo: 162, costPerSeat: 65 },
  { id: "us-2", productId: "creative-force", productName: "Creative Force", userName: "User 2", lastActiveDaysAgo: 98, costPerSeat: 57 },
  { id: "us-3", productId: "weavy", productName: "Weavy AI", userName: "User 3", lastActiveDaysAgo: 45, costPerSeat: 27 },
  { id: "us-4", productId: "capture-one", productName: "Capture One Studio", userName: "User 4", lastActiveDaysAgo: 72, costPerSeat: 50 },
  { id: "us-5", productId: "pantone", productName: "Pantone Connect", userName: "User 5", lastActiveDaysAgo: 31, costPerSeat: 22 },
];
