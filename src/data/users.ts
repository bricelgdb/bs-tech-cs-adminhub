export type AppRole =
  | "Platform Owner"
  | "Brand Design Lead"
  | "Creative Tech"
  | "IT Admin"
  | "Finance Stakeholder"
  | "Team Member";

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

export const rolePermissions: Record<AppRole, string[]> = {
  "Platform Owner": ["/dashboard", "/products", "/reports", "/access", "/licences", "/resources"],
  "Brand Design Lead": ["/dashboard", "/products", "/reports", "/resources"],
  "Creative Tech": ["/dashboard", "/products", "/resources"],
  "IT Admin": ["/dashboard", "/access", "/licences", "/resources"],
  "Finance Stakeholder": ["/dashboard", "/reports", "/licences", "/resources"],
  "Team Member": ["/dashboard", "/products", "/resources"],
};
