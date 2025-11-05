import { useState } from 'react';
import { MatchFilters as Filters } from '@/types/matchmaking';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface MatchFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Twitch'];
const NICHES = ['Fashion', 'Technology', 'Fitness', 'Beauty', 'Gaming', 'Food', 'Travel', 'Lifestyle'];
const GEOS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];

export function MatchFilters({ onFilterChange }: MatchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addArrayFilter = (key: 'platforms' | 'niches' | 'geo', value: string) => {
    const current = filters[key] || [];
    if (!current.includes(value)) {
      updateFilter(key, [...current, value]);
    }
  };

  const removeArrayFilter = (key: 'platforms' | 'niches' | 'geo', value: string) => {
    const current = filters[key] || [];
    updateFilter(key, current.filter(v => v !== value));
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(k => {
    const val = filters[k as keyof Filters];
    return Array.isArray(val) ? val.length > 0 : val !== undefined;
  }).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border">
          {/* Platform Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select onValueChange={(v) => addArrayFilter('platforms', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-1">
              {filters.platforms?.map(p => (
                <Badge key={p} variant="secondary" className="gap-1">
                  {p}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeArrayFilter('platforms', p)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Niche Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Niche</label>
            <Select onValueChange={(v) => addArrayFilter('niches', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent>
                {NICHES.map(n => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-1">
              {filters.niches?.map(n => (
                <Badge key={n} variant="secondary" className="gap-1">
                  {n}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeArrayFilter('niches', n)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Geo Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select onValueChange={(v) => addArrayFilter('geo', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {GEOS.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-1">
              {filters.geo?.map(g => (
                <Badge key={g} variant="secondary" className="gap-1">
                  {g}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeArrayFilter('geo', g)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Min Engagement */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Engagement Rate (%)</label>
            <Select onValueChange={(v) => updateFilter('minEngagement', parseFloat(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="3">3%+</SelectItem>
                <SelectItem value="4">4%+</SelectItem>
                <SelectItem value="5">5%+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Price (₹)</label>
            <Select onValueChange={(v) => updateFilter('maxPrice', parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="999999">Any</SelectItem>
                <SelectItem value="20000">20K</SelectItem>
                <SelectItem value="35000">35K</SelectItem>
                <SelectItem value="50000">50K</SelectItem>
                <SelectItem value="75000">75K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
