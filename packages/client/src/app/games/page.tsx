'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { GameGrid } from '@/components/games/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { MOCK_GAMES } from '@/data/mockGames';
import type { GameGenre } from '@/types';

const GENRES: { value: GameGenre; label: string }[] = [
  { value: 'fps', label: 'FPS' },
  { value: 'rpg', label: 'RPG' },
  { value: 'sports', label: 'Sports' },
  { value: 'racing', label: 'Racing' },
  { value: 'fighting', label: 'Fighting' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'moba', label: 'MOBA' },
  { value: 'battle_royale', label: 'Battle Royale' },
  { value: 'simulation', label: 'Simulation' },
  { value: 'horror', label: 'Horror' },
];

type SortOption = 'name' | 'rating' | 'reviews';

export default function GamesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'pc' | 'ps5' | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<GameGenre[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounce(() => setDebouncedSearch(value), 300)();
  };

  const toggleGenre = (genre: GameGenre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filteredGames = useMemo(() => {
    let games = [...MOCK_GAMES];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      games = games.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.developer.toLowerCase().includes(query) ||
          g.genre.toLowerCase().includes(query)
      );
    }

    // Platform filter
    if (selectedPlatform) {
      games = games.filter((g) => g.platform === selectedPlatform);
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      games = games.filter((g) => selectedGenres.includes(g.genre));
    }

    // Sort
    switch (sortBy) {
      case 'name':
        games.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        games.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        games.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return games;
  }, [debouncedSearch, selectedPlatform, selectedGenres, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Game Library</h1>
        <p className="text-muted-foreground">
          Browse our collection of {MOCK_GAMES.length} games across PC and PS5
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search games by name, developer, or genre..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gameedge-primary"
          >
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-6">
            {/* Platform Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Platform</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPlatform === null
                      ? 'bg-gameedge-primary/10 text-gameedge-primary'
                      : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  All Platforms
                </button>
                <button
                  onClick={() => setSelectedPlatform('pc')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPlatform === 'pc'
                      ? 'bg-gameedge-primary/10 text-gameedge-primary'
                      : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  PC
                </button>
                <button
                  onClick={() => setSelectedPlatform('ps5')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPlatform === 'ps5'
                      ? 'bg-gameedge-primary/10 text-gameedge-primary'
                      : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  PlayStation 5
                </button>
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre.value}
                    onClick={() => toggleGenre(genre.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedGenres.includes(genre.value)
                        ? 'bg-gameedge-primary text-white'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedPlatform || selectedGenres.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPlatform(null);
                  setSelectedGenres([]);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Game Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
            </p>
          </div>
          <GameGrid games={filteredGames} />
        </div>
      </div>
    </div>
  );
}