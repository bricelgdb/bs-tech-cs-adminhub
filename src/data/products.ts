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

export const products: Product[] = [
  { id: "adobe-cc", name: "Adobe Creative Cloud Suite", domain: ["Design", "Photo", "Video"], seats: 142, utilisation: 89, costMonthly: 9240, renewal: "2026-09-01", status: "active", description: "Industry-standard creative apps including Photoshop, Illustrator, InDesign, Premiere Pro, and After Effects.", adminUrl: "https://adminconsole.adobe.com", logo: adobeCcLogo },
  { id: "ai-studioone", name: "BESTSELLER AI Studio", domain: ["GenAI", "Design"], seats: 88, utilisation: 94, costMonthly: 0, renewal: null, status: "active", description: "BESTSELLER's proprietary AI-powered creative platform for generating and editing visual content at scale.", adminUrl: "https://studioone.bestseller.com/admin", logo: aiStudioOneLogo },
  { id: "capture-one", name: "Capture One Studio", domain: ["Photo"], seats: 37, utilisation: 81, costMonthly: 1840, renewal: "2026-08-01", status: "active", description: "Professional photo editing and tethered capture software for fashion and product photography.", adminUrl: "https://account.captureone.com", logo: captureOneLogo, logoScale: 1.5 },
  { id: "creative-force", name: "Creative Force", domain: ["Photo", "Production"], seats: 54, utilisation: 76, costMonthly: 3100, renewal: "2026-07-01", status: "active", description: "End-to-end content production workflow management for eCommerce photography and video.", adminUrl: "https://app.creativeforce.io/admin", logo: creativeForceLogo },
  { id: "pantone", name: "Pantone Connect", domain: ["Design", "Colour"], seats: 22, utilisation: 64, costMonthly: 480, renewal: "2026-04-28", status: "expiring", description: "Colour matching and palette management tool integrated with Adobe and design workflows.", adminUrl: "https://connect.pantone.com", logo: pantoneLogo },
  { id: "weavy", name: "Weavy AI", domain: ["GenAI", "Collaboration"], seats: 88, utilisation: 71, costMonthly: 2400, renewal: "2026-06-01", status: "active", description: "AI-powered collaboration platform for creative teams with real-time content generation.", adminUrl: "https://admin.weavy.com", logo: weavyLogo },
  { id: "midjourney", name: "Midjourney AI", domain: ["GenAI", "Design"], seats: 12, utilisation: 100, costMonthly: 960, renewal: "2026-06-01", status: "active", description: "AI image generation for concept art, moodboards, and creative exploration.", adminUrl: "https://www.midjourney.com/account", logo: midjourneyLogo },
  { id: "davinci", name: "DaVinci Resolve Studio", domain: ["Video", "Post"], seats: 20, utilisation: 85, costMonthly: 1600, renewal: "2026-05-03", status: "expiring", description: "Professional video editing, colour grading, VFX, and audio post-production.", adminUrl: "https://www.blackmagicdesign.com/account", logo: davinciLogo, logoScale: 2 },
  { id: "ipaper", name: "iPaper", domain: ["Design", "Production"], seats: 18, utilisation: 72, costMonthly: 720, renewal: "2026-10-01", status: "active", description: "Digital catalogue and interactive flipbook platform for marketing and product showcases.", adminUrl: "https://admin.ipaper.io", logo: ipaperLogo, logoScale: 1.4 },
  { id: "fonts", name: "Fonts", domain: ["Design"], seats: 65, utilisation: 80, costMonthly: 540, renewal: "2026-12-01", status: "active", description: "Centralised font licensing and typography management for creative teams.", adminUrl: "https://fonts.adobe.com", logo: fontsLogo },
];

const namePool = [
  "Emma Nielsen", "Lars Pedersen", "Sofia Andersen", "Mikkel Hansen", "Camilla Jensen",
  "Frederik Larsen", "Anna Christensen", "Oliver Rasmussen", "Ida Madsen", "Magnus Eriksen",
  "Liv Thomsen", "Jonas Olsen", "Freja Møller", "Rasmus Sørensen", "Clara Poulsen",
];

function generateLicenceUsers(productId: string, count: number): LicenceUser[] {
  const roles = ["Designer", "Editor", "Producer", "Manager", "Developer"];
  const seatTypes = ["Full", "Limited", "Viewer"];
  const statuses: LicenceUser["status"][] = ["active", "active", "active", "inactive", "pending"];
  return Array.from({ length: count }, (_, i) => ({
    id: `${productId}-user-${i}`,
    name: namePool[i % namePool.length],
    email: namePool[i % namePool.length].toLowerCase().replace(" ", ".") + "@bestseller.com",
    role: roles[i % roles.length],
    seatType: seatTypes[i % seatTypes.length],
    assignedDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-15`,
    lastActive: i % 5 === 3 ? "2025-11-01" : `2026-04-${String(10 - (i % 10)).padStart(2, "0")}`,
    status: statuses[i % statuses.length],
  }));
}

function generateAuditEvents(productId: string): AuditEvent[] {
  const actions = ["Seat assigned", "Seat revoked", "Role changed", "Integration synced", "Report exported", "Access requested", "Configuration updated"];
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${productId}-audit-${i}`,
    timestamp: `2026-04-${String(11 - i).padStart(2, "0")}T${String(9 + (i % 8)).padStart(2, "0")}:${String(i * 5 % 60).padStart(2, "0")}:00Z`,
    user: namePool[i % namePool.length],
    action: actions[i % actions.length],
    details: `${actions[i % actions.length]} for ${namePool[(i + 3) % namePool.length]}`,
  }));
}

function generateIntegrations(productId: string): Integration[] {
  const integrations: Integration[] = [
    { id: `${productId}-int-1`, name: "Azure AD SSO", status: "connected", method: "SAML 2.0", lastSync: "2026-04-11T08:00:00Z", apiKey: "sk-****-****-****-7f3a" },
    { id: `${productId}-int-2`, name: "BESTSELLER DAM", status: "connected", method: "REST API", lastSync: "2026-04-11T07:30:00Z", apiKey: "dam-****-****-9b2c" },
    { id: `${productId}-int-3`, name: "Creative Force Sync", status: productId === "creative-force" ? "connected" : "disconnected", method: "Webhook", lastSync: "2026-04-10T22:00:00Z" },
  ];
  return integrations;
}

function generateDocs(productId: string): DocLink[] {
  const product = products.find(p => p.id === productId);
  const name = product?.name ?? productId;
  return [
    { id: `${productId}-doc-1`, domain: "Vendor", title: `${name} Admin Guide`, description: `Official administration documentation for ${name}.`, href: "#" },
    { id: `${productId}-doc-2`, domain: "Internal", title: `${name} — BESTSELLER Setup Guide`, description: `Internal Confluence page covering BESTSELLER-specific configuration.`, href: "#" },
    { id: `${productId}-doc-3`, domain: "Training", title: `${name} Onboarding Course`, description: `Self-paced training for new users of ${name}.`, href: "#" },
    { id: `${productId}-doc-4`, domain: "Vendor", title: `${name} API Reference`, description: `REST API documentation and integration guides.`, href: "#" },
  ];
}

export const productLicences: Record<string, LicenceUser[]> = Object.fromEntries(
  products.map(p => [p.id, generateLicenceUsers(p.id, Math.min(p.seats, 15))])
);

export const productAudits: Record<string, AuditEvent[]> = Object.fromEntries(
  products.map(p => [p.id, generateAuditEvents(p.id)])
);

export const productIntegrations: Record<string, Integration[]> = Object.fromEntries(
  products.map(p => [p.id, generateIntegrations(p.id)])
);

export const productDocs: Record<string, DocLink[]> = Object.fromEntries(
  products.map(p => [p.id, generateDocs(p.id)])
);

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
