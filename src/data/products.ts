export type Domain = "Photo" | "Video" | "Design" | "GenAI" | "Colour" | "Collaboration" | "3D" | "Production" | "Post";
export type ProductStatus = "active" | "expiring" | "inactive";

import adobeCcLogo from "@/assets/products/adobe-cc.png";
import aiStudioOneLogo from "@/assets/products/ai-studioone.png";
import captureOneLogo from "@/assets/products/capture-one.png";
import creativeForceLogo from "@/assets/products/creative-force.jpeg";
import pantoneLogo from "@/assets/products/pantone.png";
import weavyLogo from "@/assets/products/weavy.png";
import midjourneyLogo from "@/assets/products/midjourney.png";
import davinciLogo from "@/assets/products/davinci.jpg";
import ipaperLogo from "@/assets/products/ipaper.jpeg";
import fontsLogo from "@/assets/products/fonts.png";

export const productLogos: Record<string, string> = {
  "adobe-cc": adobeCcLogo,
  "ai-studioone": aiStudioOneLogo,
  "capture-one": captureOneLogo,
  "creative-force": creativeForceLogo,
  pantone: pantoneLogo,
  weavy: weavyLogo,
  midjourney: midjourneyLogo,
  davinci: davinciLogo,
  ipaper: ipaperLogo,
  fonts: fontsLogo,
};

export interface Product {
  id: string;
  name: string;
  domain: Domain[];
  seats: number;
  utilisation: number;
  costMonthly: number;
  renewal: string | null;
  status: ProductStatus;
  description: string;
  adminUrl: string;
  logo?: string;
  logoScale?: number;
}

export interface LicenceUser {
  id: string;
  name: string;
  email: string;
  role: string;
  seatType: string;
  assignedDate: string;
  lastActive: string;
  status: "active" | "inactive" | "pending";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Integration {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  method: string;
  lastSync: string;
  apiKey?: string;
}

export interface DocLink {
  id: string;
  domain: "Vendor" | "Internal" | "Training";
  title: string;
  description: string;
  href: string;
}

// Synthetic, non-PII placeholder names for licence/audit fixtures.
const placeholderNames = Array.from({ length: 15 }, (_, i) => `User ${i + 1}`);

export function generateLicenceUsers(productId: string, count: number): LicenceUser[] {
  const roles = ["Designer", "Editor", "Producer", "Manager", "Developer"];
  const seatTypes = ["Full", "Limited", "Viewer"];
  const statuses: LicenceUser["status"][] = ["active", "active", "active", "inactive", "pending"];
  return Array.from({ length: count }, (_, i) => ({
    id: `${productId}-user-${i}`,
    name: placeholderNames[i % placeholderNames.length],
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    seatType: seatTypes[i % seatTypes.length],
    assignedDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-15`,
    lastActive: i % 5 === 3 ? "2025-11-01" : `2026-04-${String(10 - (i % 10)).padStart(2, "0")}`,
    status: statuses[i % statuses.length],
  }));
}

export function generateAuditEvents(productId: string): AuditEvent[] {
  const actions = ["Seat assigned", "Seat revoked", "Role changed", "Integration synced", "Report exported", "Access requested", "Configuration updated"];
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${productId}-audit-${i}`,
    timestamp: `2026-04-${String(11 - i).padStart(2, "0")}T${String(9 + (i % 8)).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")}:00Z`,
    user: placeholderNames[i % placeholderNames.length],
    action: actions[i % actions.length],
    details: `${actions[i % actions.length]} for ${placeholderNames[(i + 3) % placeholderNames.length]}`,
  }));
}

export function generateIntegrations(productId: string): Integration[] {
  return [
    { id: `${productId}-int-1`, name: "Azure AD SSO", status: "connected", method: "SAML 2.0", lastSync: "2026-04-11T08:00:00Z" },
    { id: `${productId}-int-2`, name: "BESTSELLER DAM", status: "connected", method: "REST API", lastSync: "2026-04-11T07:30:00Z" },
    { id: `${productId}-int-3`, name: "Creative Force Sync", status: productId === "creative-force" ? "connected" : "disconnected", method: "Webhook", lastSync: "2026-04-10T22:00:00Z" },
  ];
}

export function generateDocs(productId: string, productName: string): DocLink[] {
  return [
    { id: `${productId}-doc-1`, domain: "Vendor", title: `${productName} Admin Guide`, description: `Official administration documentation for ${productName}.`, href: "#" },
    { id: `${productId}-doc-2`, domain: "Internal", title: `${productName} — BESTSELLER Setup Guide`, description: `Internal Confluence page covering BESTSELLER-specific configuration.`, href: "#" },
    { id: `${productId}-doc-3`, domain: "Training", title: `${productName} Onboarding Course`, description: `Self-paced training for new users of ${productName}.`, href: "#" },
    { id: `${productId}-doc-4`, domain: "Vendor", title: `${productName} API Reference`, description: `REST API documentation and integration guides.`, href: "#" },
  ];
}

export const domainColorMap: Record<string, string> = {
  Photo: "hsl(214, 72%, 48%)",
  Video: "hsl(340, 65%, 55%)",
  Design: "hsl(263, 55%, 58%)",
  GenAI: "hsl(220, 14%, 20%)",
  Colour: "hsl(30, 70%, 48%)",
  Collaboration: "hsl(160, 50%, 38%)",
  "3D": "hsl(220, 8%, 52%)",
  Production: "hsl(214, 72%, 48%)",
  Post: "hsl(340, 65%, 55%)",
};

export const domainTwColor: Record<string, string> = {
  Photo: "text-domain-photo border-domain-photo bg-domain-photo/10",
  Video: "text-domain-video border-domain-video bg-domain-video/10",
  Design: "text-domain-design border-domain-design bg-domain-design/10",
  GenAI: "text-domain-genai border-domain-genai bg-domain-genai/10",
  Colour: "text-domain-colour border-domain-colour bg-domain-colour/10",
  Collaboration: "text-domain-collaboration border-domain-collaboration bg-domain-collaboration/10",
  "3D": "text-domain-3d border-domain-3d bg-domain-3d/10",
  Production: "text-domain-production border-domain-production bg-domain-production/10",
  Post: "text-domain-post border-domain-post bg-domain-post/10",
};

export const domainBorderColor: Record<string, string> = {
  Photo: "border-t-domain-photo",
  Video: "border-t-domain-video",
  Design: "border-t-domain-design",
  GenAI: "border-t-domain-genai",
  Colour: "border-t-domain-colour",
  Collaboration: "border-t-domain-collaboration",
  "3D": "border-t-domain-3d",
  Production: "border-t-domain-production",
  Post: "border-t-domain-post",
};
