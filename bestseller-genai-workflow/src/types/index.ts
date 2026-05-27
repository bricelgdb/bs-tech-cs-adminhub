export type AssetType = 'image' | 'video' | 'social' | 'ecom' | 'campaign' | 'localization';

export type WorkflowComplexity = 'quick' | 'standard' | 'advanced';

export type BrandName =
  | 'JACK & JONES'
  | 'ONLY'
  | 'VERO MODA'
  | 'Selected Homme'
  | 'Pieces'
  | 'Name It'
  | 'Mamalicious'
  | 'Object'
  | 'BESTSELLER (All Brands)';

export type MarketName =
  | 'Global'
  | 'Denmark'
  | 'Germany'
  | 'UK'
  | 'Spain'
  | 'France'
  | 'Norway'
  | 'Sweden'
  | 'Netherlands'
  | 'India'
  | 'China'
  | 'USA';

export type ToolCategory =
  | 'image-generation'
  | 'video-generation'
  | 'editing'
  | 'collaboration'
  | 'asset-management'
  | 'text-ai';

export type ApprovalStatus = 'approved' | 'evaluation' | 'restricted';

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: ToolCategory;
  approvalStatus: ApprovalStatus;
  description: string;
  capabilities: string[];
  limitations: string[];
  pricingModel: 'subscription' | 'credits' | 'per-use' | 'enterprise';
  basePrice: number;
  priceUnit: string;
  fashionScore: number;
  commercialSafe: boolean;
  logoColor: string;
  website: string;
  integrations: string[];
  tags: string[];
}

export interface BenchmarkScore {
  toolId: string;
  outputQuality: number;
  fashionRealism: number;
  brandConsistency: number;
  promptAdherence: number;
  generationSpeedSeconds: number;
  costPerGeneration: number;
  costPerUsableAsset: number;
  batchEfficiency: number;
  localizationCapability: number;
  commercialSafety: number;
  easeOfUse: number;
  bestsellerFit: number;
  successRate: number;
  lastUpdated: string;
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  toolId: string;
  modelVariant?: string;
  inputRequired: string[];
  outputProduced: string[];
  estimatedMinutes: number;
  estimatedCostUSD: number;
  promptingGuidance?: string;
  qualityRisks?: string[];
  notes?: string;
}

export interface CostScenario {
  label: 'Low' | 'Medium' | 'High';
  volumeDescription: string;
  totalCost: number;
  details: { tool: string; cost: number; units: number; unitLabel: string }[];
}

export interface CostBreakdownItem {
  toolId: string;
  stepTitle: string;
  unitCost: number;
  units: number;
  total: number;
}

export interface CostEstimate {
  timestamp: string;
  currency: 'USD';
  scenarioLow: CostScenario;
  scenarioMedium: CostScenario;
  scenarioHigh: CostScenario;
  perImage: number;
  perVideo: number;
  perCampaignBatch: number;
  perMarketAdaptation: number;
  perFinalApprovedAsset: number;
  assumptions: string[];
  breakdown: CostBreakdownItem[];
}

export interface AlternativeRoute {
  name: string;
  label: 'Best Quality' | 'Fastest' | 'Lowest Cost';
  description: string;
  tools: string[];
  estimatedCost: number;
  estimatedTimeMinutes: number;
  tradeoffs: string;
}

export interface GeneratedWorkflow {
  id: string;
  createdAt: string;
  userInput: string;
  brand: BrandName;
  markets: MarketName[];
  assetTypes: AssetType[];
  complexity: WorkflowComplexity;
  workflowCategory: WorkflowCategory;
  useCaseSummary: string;
  creativeObjective: string;
  recommendedRoute: string;
  steps: WorkflowStep[];
  totalEstimatedTimeMinutes: number;
  costEstimate: CostEstimate;
  qualityRisks: string[];
  governanceNotes: string[];
  finalRecommendation: string;
  alternativeRoutes: AlternativeRoute[];
}

export type WorkflowCategory =
  | 'social-campaign'
  | 'ecommerce-imagery'
  | 'video-concept'
  | 'market-localization'
  | 'editorial-campaign'
  | 'batch-variation'
  | 'product-storytelling';

export interface AnalysisRequest {
  userInput: string;
  brand: BrandName;
  markets: MarketName[];
  assetTypes: AssetType[];
  complexity: WorkflowComplexity;
}

export interface WorkflowHistoryEntry {
  id: string;
  userInput: string;
  brand: BrandName;
  markets: MarketName[];
  assetTypes: AssetType[];
  createdAt: string;
  totalCost: number;
  status: 'completed' | 'draft';
  category: WorkflowCategory;
  workflow?: GeneratedWorkflow;
}

export interface PricingPlan {
  name: string;
  monthly: number;
  currency: string;
  includes: string;
  perUnitCost?: number;
  perUnitDescription?: string;
  recommendedFor: string;
}

export interface PricingEntry {
  toolId: string;
  lastFetched: string;
  source: 'official' | 'api' | 'cached';
  plans: PricingPlan[];
}
