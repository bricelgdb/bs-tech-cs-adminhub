import { useQuery } from "@tanstack/react-query";
import { products, productLicences, productAudits, productIntegrations, productDocs, type Product, type LicenceUser, type AuditEvent, type Integration, type DocLink } from "@/data/products";
import { users, accessRequests, type AppUser, type AccessRequest } from "@/data/users";
import { recentActivity, type ActivityEvent } from "@/data/activity";
import { savedReports, type SavedReport } from "@/data/reports";
import { licenceRegister, unusedSeats, type LicenceRegisterEntry, type UnusedSeat } from "@/data/licences";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export function useProducts() {
  return useQuery<Product[]>({ queryKey: ["products"], queryFn: async () => { await delay(400); return products; } });
}

export function useProduct(id: string) {
  return useQuery<Product | undefined>({ queryKey: ["product", id], queryFn: async () => { await delay(400); return products.find(p => p.id === id); } });
}

export function useLicences(productId?: string) {
  return useQuery<LicenceUser[]>({ queryKey: ["licences", productId], queryFn: async () => { await delay(400); return productId ? (productLicences[productId] ?? []) : []; } });
}

export function useProductAudit(productId: string) {
  return useQuery<AuditEvent[]>({ queryKey: ["audit", productId], queryFn: async () => { await delay(400); return productAudits[productId] ?? []; } });
}

export function useProductIntegrations(productId: string) {
  return useQuery<Integration[]>({ queryKey: ["integrations", productId], queryFn: async () => { await delay(400); return productIntegrations[productId] ?? []; } });
}

export function useProductDocs(productId: string) {
  return useQuery<DocLink[]>({ queryKey: ["docs", productId], queryFn: async () => { await delay(400); return productDocs[productId] ?? []; } });
}

export function useUsers() {
  return useQuery<AppUser[]>({ queryKey: ["users"], queryFn: async () => { await delay(400); return users; } });
}

export function useAccessRequests() {
  return useQuery<AccessRequest[]>({ queryKey: ["accessRequests"], queryFn: async () => { await delay(400); return accessRequests; } });
}

export function useActivity() {
  return useQuery<ActivityEvent[]>({ queryKey: ["activity"], queryFn: async () => { await delay(400); return recentActivity; } });
}

export function useReports() {
  return useQuery<SavedReport[]>({ queryKey: ["reports"], queryFn: async () => { await delay(400); return savedReports; } });
}

export function useLicenceRegister() {
  return useQuery<LicenceRegisterEntry[]>({ queryKey: ["licenceRegister"], queryFn: async () => { await delay(400); return licenceRegister; } });
}

export function useUnusedSeats() {
  return useQuery<UnusedSeat[]>({ queryKey: ["unusedSeats"], queryFn: async () => { await delay(400); return unusedSeats; } });
}
