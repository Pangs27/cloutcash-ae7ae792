import { useState, useEffect, useCallback } from 'react';
import { ScoredCandidate, Influencer, MatchFilters } from '@/types/matchmaking';
import { mockApi } from '@/lib/mockApi';
import { useAuth } from './useAuth';
import { mockBrandCampaigns } from '@/lib/mockData';

export function useMatchFeed(role: 'brand' | 'creator') {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<ScoredCandidate<Influencer>[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [filters, setFilters] = useState<MatchFilters>({});
  const [hasMore, setHasMore] = useState(true);

  const fetchBatch = useCallback(async (reset: boolean = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const currentCursor = reset ? 0 : cursor;
      
      // For mock purposes, use first brand campaign
      const userCampaign = role === 'brand' ? mockBrandCampaigns[0] : null;
      
      const { candidates: newCandidates, nextCursor } = await mockApi.getRankedBatch(
        user.id,
        role,
        userCampaign,
        currentCursor,
        filters,
        10
      );

      if (reset) {
        setCandidates(newCandidates);
      } else {
        setCandidates(prev => [...prev, ...newCandidates]);
      }
      
      setCursor(nextCursor);
      setHasMore(newCandidates.length === 10);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }, [user, role, cursor, filters]);

  const updateFilters = useCallback((newFilters: MatchFilters) => {
    setFilters(newFilters);
    setCursor(0);
    setCandidates([]);
    mockApi.clearSeenIds();
  }, []);

  const refetch = useCallback(() => {
    setCursor(0);
    setCandidates([]);
    mockApi.clearSeenIds();
    fetchBatch(true);
  }, [fetchBatch]);

  useEffect(() => {
    if (user) {
      fetchBatch(true);
    }
  }, [user, filters]);

  return {
    candidates,
    loading,
    hasMore,
    fetchMore: () => fetchBatch(false),
    updateFilters,
    refetch
  };
}
