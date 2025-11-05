import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ScoredCandidate, Influencer } from '@/types/matchmaking';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MapPin, Users, TrendingUp, DollarSign } from 'lucide-react';

interface SwipeDeckProps {
  candidates: ScoredCandidate<Influencer>[];
  onSwipe: (candidateId: string, direction: 'left' | 'right' | 'up') => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function SwipeDeck({ candidates, onSwipe, onLoadMore, hasMore }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const currentCandidate = candidates[currentIndex];

  useEffect(() => {
    // Load more when approaching end
    if (currentIndex >= candidates.length - 2 && hasMore) {
      onLoadMore();
    }
  }, [currentIndex, candidates.length, hasMore, onLoadMore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
      if (e.key === 'ArrowUp') handleSwipe('up');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 200 : -200);
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentCandidate) return;

    if (direction === 'right') setExitX(200);
    if (direction === 'left') setExitX(-200);

    onSwipe(currentCandidate.item.id, direction);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitX(0);
      x.set(0);
    }, 200);
  };

  if (!currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Users className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-xl font-semibold">No more matches</h3>
        <p className="text-muted-foreground">Check back later for new opportunities!</p>
      </div>
    );
  }

  const { item: influencer, score, why } = currentCandidate;

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      <motion.div
        style={{
          x,
          rotate,
          opacity,
          cursor: 'grab'
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={exitX !== 0 ? { x: exitX } : {}}
        className="absolute w-full"
      >
        <Card className="overflow-hidden bg-card border-2">
          {/* Banner/Avatar */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
            {influencer.avatar && (
              <img
                src={influencer.avatar}
                alt={influencer.handle}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-primary">
                {Math.round(score * 100)}% Match
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{influencer.handle}</h3>
              <p className="text-muted-foreground mt-1">{influencer.bio}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{(influencer.followers / 1000).toFixed(0)}K followers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>{influencer.engagementRate}% ER</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>₹{(influencer.pricePerPost / 1000).toFixed(0)}K/post</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{influencer.audienceGeo[0]}</span>
              </div>
            </div>

            {/* Niches */}
            <div className="flex flex-wrap gap-2">
              {influencer.niches.map(niche => (
                <Badge key={niche} variant="secondary">
                  {niche}
                </Badge>
              ))}
            </div>

            {/* Platforms */}
            <div className="flex gap-2">
              {influencer.platforms.map(platform => (
                <Badge key={platform} variant="outline">
                  {platform}
                </Badge>
              ))}
            </div>

            {/* Why this match */}
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-2">Why this match?</p>
              <div className="flex flex-wrap gap-1">
                {why.map((reason, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full"
          onClick={() => handleSwipe('left')}
          aria-label="Pass"
        >
          <X className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          variant="default"
          className="w-16 h-16 rounded-full"
          onClick={() => handleSwipe('right')}
          aria-label="Like"
        >
          <Heart className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70"
          onClick={() => handleSwipe('up')}
          aria-label="Super Like"
        >
          <Star className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
