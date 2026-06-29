'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { GameGrid } from '@/components/games/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { debounce } from '@/lib/utils';
import type { Game, GameGenre } from '@/types';

const MOCK_GAMES: Game[] = [
  { id: '1', name: 'Valorant', platform: 'pc', genre: 'fps', coverImage: '', description: 'Tactical 5v5 shooter with unique agent abilities', rating: 4.8, reviewCount: 234, releaseYear: 2020, developer: 'Riot Games' },
  { id: '2', name: 'Counter-Strike 2', platform: 'pc', genre: 'fps', coverImage: '', description: 'The next evolution of Counter-Strike', rating: 4.7, reviewCount: 567, releaseYear: 2023, developer: 'Valve' },
  { id: '3', name: 'FIFA 24', platform: 'ps5', genre: 'sports', coverImage: '', description: 'The world\'s game, powered by HyperMotion', rating: 4.6, reviewCount: 189, releaseYear: 2023, developer: 'EA Sports' },
  { id: '4', name: 'League of Legends', platform: 'pc', genre: 'moba', coverImage: '', description: '5v5 MOBA with 160+ champions', rating: 4.5, reviewCount: 456, releaseYear: 2009, developer: 'Riot Games' },
  { id: '5', name: 'Dota 2', platform: 'pc', genre: 'moba', coverImage: '', description: 'Every day is a good day to defend the ancient', rating: 4.4, reviewCount: 345, releaseYear: 2013, developer: 'Valve' },
  { id: '6', name: 'Spider-Man 2', platform: 'ps5', genre: 'rpg', coverImage: '', description: 'Swing through NYC as Peter and Miles', rating: 4.9, reviewCount: 127, releaseYear: 2023, developer: 'Insomniac Games' },
  { id: '7', name: 'God of War Ragnarok', platform: 'ps5', genre: 'rpg', coverImage: '', description: 'Epic Norse mythology action-adventure', rating: 4.8, reviewCount: 234, releaseYear: 2022, developer: 'Santa Monica Studio' },
  { id: '8', name: 'Fortnite', platform: 'pc', genre: 'battle_royale', coverImage: '', description: '100-player battle royale with building', rating: 4.4, reviewCount: 567, releaseYear: 2017, developer: 'Epic Games' },
  { id: '9', name: 'Street Fighter 6', platform: 'ps5', genre: 'fighting', coverImage: '', description: 'The next generation of fighting games', rating: 4.7, reviewCount: 98, releaseYear: 2023, developer: 'Capcom' },
  { id: '10', name: 'Tekken 8', platform: 'ps5', genre: 'fighting', coverImage: '', description: 'The next chapter of the legendary fighting franchise', rating: 4.6, reviewCount: 76, releaseYear: 2024, developer: 'Bandai Namco' },
  { id: '11', name: 'Forza Horizon 5', platform: 'pc', genre: 'racing', coverImage: '', description: 'Open-world racing in Mexico', rating: 4.7, reviewCount: 189, releaseYear: 2021, developer: 'Playground Games' },
  { id: '12', name: 'Gran Turismo 7', platform: 'ps5', genre: 'racing', coverImage: '', description: 'The real driving simulator', rating: 4.5, reviewCount: 134, releaseYear: 2022, developer: 'Polyphony Digital' },
  { id: '13', name: 'Elden Ring', platform: 'pc', genre: 'rpg', coverImage: '', description: 'Open-world action RPG by FromSoftware', rating: 4.9, reviewCount: 345, releaseYear: 2022, developer: 'FromSoftware' },
  { id: '14', name: 'Baldur\'s Gate 3', platform: 'pc', genre: 'rpg', coverImage: '', description: 'D&D-based RPG with unprecedented freedom', rating: 4.9, reviewCount: 234, releaseYear: 2023, developer: 'Larian Studios' },
  { id: '15', name: 'Rocket League', platform: 'pc', genre: 'sports', coverImage: '', description: 'Soccer with rocket-powered cars', rating: 4.3, reviewCount: 456, releaseYear: 2015, developer: 'Psyonix' },
  { id: '16', name: 'Overwatch 2', platform: 'pc', genre: 'fps', coverImage: '', description: 'Team-based action with 40+ heroes', rating: 4.2, reviewCount: 345, releaseYear: 2022, developer: 'Blizzard' },
  { id: '17', name: 'Apex Legends', platform: 'pc', genre: 'battle_royale', coverImage: '', description: 'Legend-based battle royale', rating: 4.5, reviewCount: 567, releaseYear: 2019, developer: 'Respawn' },
  { id: '18', name: 'Madden NFL 24', platform: 'ps5', genre: 'sports', coverImage: '', description: 'The ultimate NFL simulation', rating: 4.3, reviewCount: 89, releaseYear: 2023, developer: 'EA Sports' },
  { id: '19', name: 'Civilization VI', platform: 'pc', genre: 'strategy', coverImage: '', description: 'Build an empire to stand the test of time', rating: 4.6, reviewCount: 234, releaseYear: 2016, developer: 'Firaxis' },
  { id: '20', name: 'Age of Empires IV', platform: 'pc', genre: 'strategy', coverImage: '', description: 'Real-time strategy with historical civilizations', rating: 4.5, reviewCount: 123, releaseYear: 2021, developer: 'Relic Entertainment' },
  { id: '21', name: 'Resident Evil 4', platform: 'ps5', genre: 'horror', coverImage: '', description: 'Survival horror reimagined', rating: 4.8, reviewCount: 234, releaseYear: 2023, developer: 'Capcom' },
  { id: '22', name: 'Dead Space', platform: 'pc', genre: 'horror', coverImage: '', description: 'Sci-fi survival horror remake', rating: 4.6, reviewCount: 156, releaseYear: 2023, developer: 'Motive Studio' },
  { id: '23', name: 'F1 24', platform: 'ps5', genre: 'racing', coverImage: '', description: 'Official F1 game', rating: 4.4, reviewCount: 78, releaseYear: 2024, developer: 'Codemasters' },
  { id: '24', name: 'Starfield', platform: 'pc', genre: 'rpg', coverImage: '', description: 'Bethesda\'s space exploration RPG', rating: 4.1, reviewCount: 234, releaseYear: 2023, developer: 'Bethesda' },
];

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
