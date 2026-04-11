export interface ActivityEvent {
  id: string;
  dotColour: "green" | "amber" | "blue" | "red";
  action: string;
  timestamp: string;
  actor: string;
}

export const recentActivity: ActivityEvent[] = [
  { id: "act-1", dotColour: "green", action: "Assigned Adobe CC seat to Camilla Jensen", timestamp: "2026-04-11T09:15:00Z", actor: "Martin Kjær" },
  { id: "act-2", dotColour: "blue", action: "Generated monthly utilisation report", timestamp: "2026-04-11T08:42:00Z", actor: "Frederik Larsen" },
  { id: "act-3", dotColour: "amber", action: "Pantone Connect renewal due in 17 days", timestamp: "2026-04-11T08:00:00Z", actor: "System" },
  { id: "act-4", dotColour: "green", action: "Weavy AI integration sync completed", timestamp: "2026-04-10T22:30:00Z", actor: "System" },
  { id: "act-5", dotColour: "red", action: "Access request pending: Viktor Holm → Weavy AI", timestamp: "2026-04-10T16:20:00Z", actor: "Viktor Holm" },
  { id: "act-6", dotColour: "blue", action: "DaVinci Resolve configuration updated", timestamp: "2026-04-10T14:10:00Z", actor: "Mikkel Hansen" },
  { id: "act-7", dotColour: "green", action: "BESTSELLER AI StudioOne v2.4 deployed", timestamp: "2026-04-10T11:00:00Z", actor: "System" },
  { id: "act-8", dotColour: "amber", action: "DaVinci Resolve Studio renewal due in 22 days", timestamp: "2026-04-10T08:00:00Z", actor: "System" },
  { id: "act-9", dotColour: "green", action: "Revoked inactive seat: Freja Møller → Creative Force", timestamp: "2026-04-09T15:45:00Z", actor: "Martin Kjær" },
  { id: "act-10", dotColour: "blue", action: "Access request submitted: Liv Thomsen → AI StudioOne", timestamp: "2026-04-09T13:22:00Z", actor: "Liv Thomsen" },
  { id: "act-11", dotColour: "green", action: "Capture One licence bulk renewal processed", timestamp: "2026-04-09T10:00:00Z", actor: "Rasmus Sørensen" },
  { id: "act-12", dotColour: "blue", action: "Exported Q1 licence cost report (PDF)", timestamp: "2026-04-08T16:30:00Z", actor: "Frederik Larsen" },
  { id: "act-13", dotColour: "amber", action: "Midjourney AI at 100% seat utilisation", timestamp: "2026-04-08T09:00:00Z", actor: "System" },
  { id: "act-14", dotColour: "green", action: "Onboarded Nora Berg to Adobe CC + Midjourney", timestamp: "2026-04-07T14:15:00Z", actor: "Martin Kjær" },
  { id: "act-15", dotColour: "red", action: "Creative Force API key rotation required", timestamp: "2026-04-07T08:00:00Z", actor: "System" },
];
