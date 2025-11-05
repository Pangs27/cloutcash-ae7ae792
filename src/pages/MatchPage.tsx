import { Navbar } from '@/components/Navbar';
import { SwipeDeck } from '@/components/SwipeDeck';
import { MatchFilters } from '@/components/MatchFilters';
import { useMatchFeed } from '@/hooks/useMatchFeed';
import { useFeedback } from '@/hooks/useFeedback';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MatchPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // For now, default to 'brand' role
  const role = 'brand';
  const { candidates, loading, hasMore, fetchMore, updateFilters } = useMatchFeed(role);
  const { recordFeedback } = useFeedback();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSwipe = async (candidateId: string, direction: 'left' | 'right' | 'up') => {
    const type = direction === 'left' ? 'pass' : direction === 'up' ? 'superlike' : 'like';
    await recordFeedback(candidateId, type);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-32">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Discover Perfect Matches
            </h1>
            <p className="text-muted-foreground">
              Smart matchmaking powered by transparent AI scoring
            </p>
          </div>

          <MatchFilters onFilterChange={updateFilters} />

          <div className="mt-8">
            <SwipeDeck
              candidates={candidates}
              onSwipe={handleSwipe}
              onLoadMore={fetchMore}
              hasMore={hasMore}
            />
          </div>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Use ← → ↑ arrow keys or swipe to navigate</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchPage;
