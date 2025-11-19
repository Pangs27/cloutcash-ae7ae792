import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Star, Heart, MapPin, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useMatchFeed } from '@/hooks/useMatchFeed';
import { useFeedback } from '@/hooks/useFeedback';
import { Navbar } from '@/components/Navbar';
import { Influencer } from '@/types/matchmaking';

export default function DiscoverPage() {
  const { candidates, loading, fetchMore, hasMore, updateFilters } = useMatchFeed('brand');
  const { recordFeedback } = useFeedback();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter states
  const [filterNiches, setFilterNiches] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBudgetRange, setFilterBudgetRange] = useState([0, 100000]);
  const [filterEngagement, setFilterEngagement] = useState([0]);
  const [filterFollowers, setFilterFollowers] = useState([0]);

  const currentCandidate = candidates[currentIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (!currentCandidate) return;

    const interactionType = direction === 'right' ? 'like' : direction === 'up' ? 'superlike' : 'pass';
    await recordFeedback(currentCandidate.item.id, interactionType);

    setCurrentIndex(prev => prev + 1);
    x.set(0);

    if (currentIndex >= candidates.length - 2 && hasMore) {
      fetchMore();
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else if (info.offset.y < -100) {
      handleSwipe('up');
    }
  };

  const handleApplyFilters = () => {
    updateFilters({
      niches: filterNiches ? filterNiches.split(',').map(n => n.trim()) : undefined,
      geo: filterLocation ? filterLocation.split(',').map(l => l.trim()) : undefined,
      maxPrice: filterBudgetRange[1] > 0 ? filterBudgetRange[1] : undefined,
      minEngagement: filterEngagement[0] > 0 ? filterEngagement[0] : undefined,
    });
    setCurrentIndex(0);
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onHomeClick={() => {}} onContactClick={() => {}} onAboutClick={() => {}} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onHomeClick={() => {}} onContactClick={() => {}} onAboutClick={() => {}} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Filters */}
        <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., Fashion, Tech"
                value={filterNiches}
                onChange={(e) => setFilterNiches(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Mumbai, Delhi"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Budget Range (₹/post)</Label>
              <div className="mt-4 mb-2">
                <Slider
                  value={filterBudgetRange}
                  onValueChange={setFilterBudgetRange}
                  max={100000}
                  step={5000}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>₹{filterBudgetRange[0].toLocaleString()}</span>
                  <span>₹{filterBudgetRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Min Engagement Rate (%)</Label>
              <div className="mt-4 mb-2">
                <Slider
                  value={filterEngagement}
                  onValueChange={setFilterEngagement}
                  max={20}
                  step={0.5}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground mt-2">
                  {filterEngagement[0]}%
                </div>
              </div>
            </div>

            <div>
              <Label>Min Followers</Label>
              <div className="mt-4 mb-2">
                <Slider
                  value={filterFollowers}
                  onValueChange={setFilterFollowers}
                  max={1000000}
                  step={10000}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground mt-2">
                  {filterFollowers[0].toLocaleString()}
                </div>
              </div>
            </div>

            <Button onClick={handleApplyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Main Content - Swipe Cards */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {currentCandidate ? (
            <div className="relative w-full max-w-md">
              {/* Card Stack */}
              <div className="relative h-[600px]">
                {/* Background cards */}
                {candidates.slice(currentIndex + 1, currentIndex + 3).map((candidate, idx) => (
                  <Card
                    key={candidate.item.id}
                    className="absolute inset-0 bg-card border-2 border-border"
                    style={{
                      transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * -10}px)`,
                      zIndex: -idx - 1,
                      opacity: 1 - (idx + 1) * 0.3,
                    }}
                  />
                ))}

                {/* Active card */}
                <motion.div
                  style={{
                    x,
                    rotate,
                    opacity,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Card className="h-full bg-card border-2 overflow-hidden shadow-[0_0_30px_rgba(354,78%,58%,0.2)]">
                    <ProfileCard influencer={currentCandidate.item} matchScore={currentCandidate.score} />
                  </Card>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-6 mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-2 border-destructive hover:bg-destructive/10"
                  onClick={() => handleSwipe('left')}
                >
                  <X className="w-8 h-8 text-destructive" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-2 border-accent hover:bg-accent/10"
                  onClick={() => handleSwipe('up')}
                >
                  <Star className="w-8 h-8 text-accent" />
                </Button>
                
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(354,78%,58%,0.4)]"
                  onClick={() => handleSwipe('right')}
                >
                  <Heart className="w-10 h-10 fill-primary-foreground" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
              <p className="text-muted-foreground mb-4">Adjust your filters to see more</p>
              <Button onClick={() => updateFilters({})}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ influencer, matchScore }: { influencer: Influencer; matchScore: number }) {
  return (
    <div className="h-full flex flex-col">
      {/* Match Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-primary/90 text-primary-foreground px-3 py-1 text-sm font-bold shadow-[0_0_20px_rgba(354,78%,58%,0.5)]">
          {Math.round(matchScore * 100)}% Match
        </Badge>
      </div>

      {/* Profile Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/10">
        {influencer.avatar ? (
          <img
            src={influencer.avatar}
            alt={influencer.name || influencer.handle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-16 h-16 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-2xl font-bold">{influencer.name || influencer.handle}</h3>
          <p className="text-muted-foreground">@{influencer.handle}</p>
        </div>

        {/* Niche Badge */}
        <div>
          <Badge variant="secondary" className="text-sm">
            {influencer.niches[0]}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{influencer.audienceGeo[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span>₹{(influencer.pricePerPost / 1000).toFixed(0)}K/post</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{(influencer.followers / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>{influencer.engagementRate}% ER</span>
          </div>
        </div>

        {/* Bio */}
        {influencer.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">{influencer.bio}</p>
        )}

        {/* Mini Insights */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Audience Overlap</div>
              <div className="text-sm font-semibold text-primary">
                {Math.round(matchScore * 85)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Engagement</div>
              <div className="text-sm font-semibold text-accent">
                {influencer.engagementRate > 5 ? 'High' : influencer.engagementRate > 2 ? 'Mid' : 'Low'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tone Fit</div>
              <div className="text-sm font-semibold text-primary">
                {matchScore > 0.8 ? 'Great' : matchScore > 0.6 ? 'Good' : 'Fair'}
              </div>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex gap-2 flex-wrap">
          {influencer.platforms.map(platform => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
