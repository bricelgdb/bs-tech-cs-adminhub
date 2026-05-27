import { BenchmarkScore, AssetType, WorkflowCategory } from '../types';
import { benchmarkScores, getCompositeScore } from '../data/benchmarks';

interface WeightProfile {
  outputQuality: number;
  fashionRealism: number;
  brandConsistency: number;
  promptAdherence: number;
  batchEfficiency: number;
  localizationCapability: number;
  commercialSafety: number;
  easeOfUse: number;
  bestsellerFit: number;
}

const profileByCategory: Record<WorkflowCategory, WeightProfile> = {
  'editorial-campaign': {
    outputQuality: 0.20, fashionRealism: 0.20, brandConsistency: 0.12, promptAdherence: 0.08,
    batchEfficiency: 0.05, localizationCapability: 0.05, commercialSafety: 0.10, easeOfUse: 0.05, bestsellerFit: 0.15,
  },
  'ecommerce-imagery': {
    outputQuality: 0.15, fashionRealism: 0.12, brandConsistency: 0.15, promptAdherence: 0.12,
    batchEfficiency: 0.15, localizationCapability: 0.05, commercialSafety: 0.12, easeOfUse: 0.07, bestsellerFit: 0.07,
  },
  'social-campaign': {
    outputQuality: 0.12, fashionRealism: 0.10, brandConsistency: 0.15, promptAdherence: 0.10,
    batchEfficiency: 0.12, localizationCapability: 0.10, commercialSafety: 0.10, easeOfUse: 0.10, bestsellerFit: 0.11,
  },
  'video-concept': {
    outputQuality: 0.18, fashionRealism: 0.18, brandConsistency: 0.10, promptAdherence: 0.10,
    batchEfficiency: 0.05, localizationCapability: 0.07, commercialSafety: 0.12, easeOfUse: 0.07, bestsellerFit: 0.13,
  },
  'market-localization': {
    outputQuality: 0.10, fashionRealism: 0.08, brandConsistency: 0.15, promptAdherence: 0.10,
    batchEfficiency: 0.10, localizationCapability: 0.22, commercialSafety: 0.10, easeOfUse: 0.08, bestsellerFit: 0.07,
  },
  'batch-variation': {
    outputQuality: 0.12, fashionRealism: 0.10, brandConsistency: 0.12, promptAdherence: 0.12,
    batchEfficiency: 0.22, localizationCapability: 0.05, commercialSafety: 0.12, easeOfUse: 0.07, bestsellerFit: 0.08,
  },
  'product-storytelling': {
    outputQuality: 0.18, fashionRealism: 0.18, brandConsistency: 0.14, promptAdherence: 0.10,
    batchEfficiency: 0.05, localizationCapability: 0.05, commercialSafety: 0.10, easeOfUse: 0.07, bestsellerFit: 0.13,
  },
};

export function getWeightedScore(score: BenchmarkScore, category: WorkflowCategory): number {
  const w = profileByCategory[category] ?? profileByCategory['editorial-campaign'];
  return (
    score.outputQuality * w.outputQuality +
    score.fashionRealism * w.fashionRealism +
    score.brandConsistency * w.brandConsistency +
    score.promptAdherence * w.promptAdherence +
    score.batchEfficiency * w.batchEfficiency +
    score.localizationCapability * w.localizationCapability +
    score.commercialSafety * w.commercialSafety +
    score.easeOfUse * w.easeOfUse +
    score.bestsellerFit * w.bestsellerFit
  );
}

export function rankToolsForCategory(
  category: WorkflowCategory,
  toolIds?: string[],
): (BenchmarkScore & { weightedScore: number; compositeScore: number })[] {
  const scores = toolIds
    ? benchmarkScores.filter(s => toolIds.includes(s.toolId))
    : benchmarkScores;

  return scores
    .map(s => ({
      ...s,
      weightedScore: parseFloat(getWeightedScore(s, category).toFixed(2)),
      compositeScore: parseFloat(getCompositeScore(s).toFixed(2)),
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);
}

export function getTopToolForStep(stepType: 'ideation' | 'image' | 'video' | 'edit' | 'localise' | 'review'): string {
  const map: Record<string, string> = {
    ideation: 'chatgpt4o',
    image: 'midjourney',
    video: 'runway-gen3',
    edit: 'adobe-photoshop-ai',
    localise: 'adobe-express',
    review: 'weavy',
  };
  return map[stepType] ?? 'adobe-firefly';
}

export function getScoreColor(score: number): string {
  if (score >= 8.5) return 'text-emerald-600 bg-emerald-50';
  if (score >= 7.0) return 'text-blue-600 bg-blue-50';
  if (score >= 5.5) return 'text-amber-600 bg-amber-50';
  return 'text-red-500 bg-red-50';
}

export function getScoreLabel(score: number): string {
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.0) return 'Good';
  if (score >= 5.5) return 'Fair';
  return 'Poor';
}

export function formatSpeed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

export interface AssetTypeWeights {
  assetType: AssetType;
  primaryTools: string[];
  reason: string;
}

export const assetTypeRecommendations: AssetTypeWeights[] = [
  {
    assetType: 'image',
    primaryTools: ['midjourney', 'adobe-firefly', 'adobe-photoshop-ai'],
    reason: 'Midjourney for hero quality; Firefly for brand-safe production; Photoshop AI for finalisation',
  },
  {
    assetType: 'video',
    primaryTools: ['runway-gen3', 'kling-ai', 'adobe-express'],
    reason: 'Runway Gen-3 for cinematic AI video; Kling AI for fashion motion (evaluation); Adobe Express for social video assembly',
  },
  {
    assetType: 'social',
    primaryTools: ['adobe-express', 'adobe-firefly', 'chatgpt4o'],
    reason: 'Adobe Express for rapid social-sized production; Firefly for brand-safe imagery; ChatGPT for captions/copy',
  },
  {
    assetType: 'ecom',
    primaryTools: ['adobe-firefly', 'midjourney', 'adobe-photoshop-ai'],
    reason: 'Firefly for commercially safe batch product imagery; Midjourney for lifestyle shots; Photoshop AI for retouching',
  },
  {
    assetType: 'campaign',
    primaryTools: ['midjourney', 'chatgpt4o', 'adobe-photoshop-ai', 'weavy'],
    reason: 'Midjourney for premium campaign visuals; ChatGPT for concept and copy; Photoshop for retouching; Weavy for approval',
  },
  {
    assetType: 'localization',
    primaryTools: ['adobe-firefly', 'adobe-express', 'chatgpt4o', 'weavy'],
    reason: 'Firefly for environment adaptation; Express for market-specific sizing and copy; ChatGPT for translation/localisation; Weavy for market approvals',
  },
];
