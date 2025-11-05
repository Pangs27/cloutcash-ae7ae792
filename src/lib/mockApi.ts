import { Influencer, BrandCampaign, Interaction, InteractionType, ScoredCandidate, MatchFilters } from '@/types/matchmaking';
import { mockInfluencers, mockBrandCampaigns, mockInteractions } from './mockData';
import { rankCandidates } from './matchmaker';

// In-memory storage for interactions
let interactions: Interaction[] = [...mockInteractions];
const seenIds = new Set<string>();

export const mockApi = {
  async getRankedBatch(
    userId: string,
    role: 'brand' | 'creator',
    userCampaign: BrandCampaign | null,
    cursor: number = 0,
    filters?: MatchFilters,
    limit: number = 10
  ): Promise<{ candidates: ScoredCandidate<Influencer>[]; nextCursor: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userInteractions = interactions.filter(i => i.userId === userId);
    const context = {
      userId,
      role,
      interactions: userInteractions
    };
    
    // Get all candidates excluding already seen ones in this session
    const candidates = mockInfluencers.filter(inf => !seenIds.has(inf.id));
    
    // Rank candidates
    const ranked = rankCandidates(role, userCampaign, candidates, context, filters);
    
    // Paginate
    const batch = ranked.slice(cursor, cursor + limit);
    
    // Mark as seen
    batch.forEach(c => seenIds.add(c.item.id));
    
    return {
      candidates: batch,
      nextCursor: cursor + limit
    };
  },

  async recordInteraction(
    userId: string,
    targetId: string,
    type: InteractionType
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const interaction: Interaction = {
      userId,
      targetId,
      type,
      ts: Date.now()
    };
    
    interactions.push(interaction);
    
    // Track analytics
    console.log(`[Analytics] ${type}:`, { userId, targetId, ts: interaction.ts });
  },

  async getInteractions(userId: string): Promise<Interaction[]> {
    return interactions.filter(i => i.userId === userId);
  },

  clearSeenIds() {
    seenIds.clear();
  },

  resetInteractions() {
    interactions = [];
    seenIds.clear();
  }
};
