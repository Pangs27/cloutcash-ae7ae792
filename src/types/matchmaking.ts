export interface Influencer {
  id: string;
  handle: string;
  platforms: string[];
  niches: string[];
  audienceGeo: string[];
  audienceAge: string[];
  audienceGenderMix: { male: number; female: number; other: number };
  followers: number;
  avgViews: number;
  engagementRate: number;
  contentQuality: number; // 1-5
  brandSafety: number; // 1-5
  pricePerPost: number;
  availability: boolean;
  pastBrands: string[];
  fraudRisk: number; // 0-1
  avatar?: string;
  bio?: string;
}

export interface BrandCampaign {
  id: string;
  brandName: string;
  categories: string[];
  targetGeo: string[];
  targetAge: string[];
  targetGenderMix: { male: number; female: number; other: number };
  minFollowers: number;
  minEngagement: number;
  maxPrice: number;
  creativesNeeded: number;
  timeline: string;
  brandSafetyMin: number;
  exclusions: string[];
  preferredPlatforms: string[];
  budgetCoins: number;
  logo?: string;
  description?: string;
}

export type InteractionType = 'like' | 'pass' | 'superlike' | 'match';

export interface Interaction {
  userId: string;
  targetId: string;
  type: InteractionType;
  ts: number;
}

export interface ScoredCandidate<T = Influencer | BrandCampaign> {
  item: T;
  score: number;
  why: string[];
}

export interface MatchFilters {
  platforms?: string[];
  niches?: string[];
  geo?: string[];
  maxBudget?: number;
  minEngagement?: number;
  maxPrice?: number;
}

export interface UserContext {
  userId: string;
  role: 'brand' | 'creator';
  interactions: Interaction[];
  preferences?: Record<string, number>;
}
