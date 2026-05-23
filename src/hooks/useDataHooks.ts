import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  productLogos,
  generateLicenceUsers,
  generateAuditEvents,
  generateIntegrations,
  generateDocs,
  type Product,
  type LicenceUser,
  type AuditEvent,
  type Integration,
  type DocLink,
  type Domain,
} from "@/data/products";
import type { AppUser, AccessRequest, AppRole } from "@/data/users";
import { recentActivity, type ActivityEvent } from "@/data/activity";
import { savedReports, type SavedReport } from "@/data/reports";
import { licenceRegister, unusedSeats, type LicenceRegisterEntry, type UnusedSeat } from "@/data/licences";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mapProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    domain: (row.domain ?? []) as Domain[],
    seats: row.seats,
    utilisation: row.utilisation,
    costMonthly: row.cost_monthly,
    renewal: row.renewal,
    status: row.status,
    description: row.description,
    adminUrl: row.admin_url,
    logo: row.logo_key ? productLogos[row.logo_key] : undefined,
    logoScale: row.logo_scale ?? undefined,
  };
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []).map(mapProductRow);
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product | undefined>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapProductRow(data) : undefined;
    },
  });
}

export function useLicences(productId?: string) {
  return useQuery<LicenceUser[]>({
    queryKey: ["licences", productId],
    queryFn: async () => {
      await delay(200);
      return productId ? generateLicenceUsers(productId, 12) : [];
    },
  });
}

export function useProductAudit(productId: string) {
  return useQuery<AuditEvent[]>({
    queryKey: ["audit", productId],
    queryFn: async () => {
      await delay(200);
      return generateAuditEvents(productId);
    },
  });
}

export function useProductIntegrations(productId: string) {
  return useQuery<Integration[]>({
    queryKey: ["integrations", productId],
    queryFn: async () => {
      await delay(200);
      return generateIntegrations(productId);
    },
  });
}

export function useProductDocs(productId: string) {
  return useQuery<DocLink[]>({
    queryKey: ["docs", productId],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("name").eq("id", productId).maybeSingle();
      return generateDocs(productId, data?.name ?? productId);
    },
  });
}

export function useUsers() {
  return useQuery<AppUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("id, name, email, brand, initials, last_active, status"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      const roleMap = new Map<string, AppRole>();
      (roleRows ?? []).forEach((r: { user_id: string; role: AppRole }) => {
        if (!roleMap.has(r.user_id)) roleMap.set(r.user_id, r.role);
      });
      return (profiles ?? []).map((p: any) => ({
        id: p.id,
        name: p.name || p.email,
        email: p.email,
        brand: p.brand,
        role: roleMap.get(p.id) ?? ("Team Member" as AppRole),
        productAccess: [],
        lastActive: p.last_active,
        status: p.status,
        initials: p.initials || (p.email?.[0] ?? "U").toUpperCase(),
      }));
    },
  });
}

export function useAccessRequests() {
  return useQuery<AccessRequest[]>({
    queryKey: ["accessRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select("id, user_id, product_id, role_requested, submitted_date, profiles!inner(name, brand), products!inner(name)");
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.profiles?.name ?? "Unknown",
        productId: r.product_id,
        productName: r.products?.name ?? r.product_id,
        roleRequested: r.role_requested,
        brand: r.profiles?.brand ?? "",
        submittedDate: r.submitted_date,
      }));
    },
  });
}

export function useActivity() {
  return useQuery<ActivityEvent[]>({ queryKey: ["activity"], queryFn: async () => { await delay(200); return recentActivity; } });
}

export function useReports() {
  return useQuery<SavedReport[]>({ queryKey: ["reports"], queryFn: async () => { await delay(200); return savedReports; } });
}

export function useLicenceRegister() {
  return useQuery<LicenceRegisterEntry[]>({ queryKey: ["licenceRegister"], queryFn: async () => { await delay(200); return licenceRegister; } });
}

export function useUnusedSeats() {
  return useQuery<UnusedSeat[]>({ queryKey: ["unusedSeats"], queryFn: async () => { await delay(200); return unusedSeats; } });
}
