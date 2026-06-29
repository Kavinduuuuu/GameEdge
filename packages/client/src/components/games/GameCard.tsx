'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Monitor, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Game } from '@/types';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:border-gameedge-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <CardContent className="p-0">
          {/* Cover Art */}
          <div className="relative aspect-[3/4] bg-gradient-to-br from-gameedge-dark-700 to-gameedge-dark-800 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {game.platform === 'pc' ? (
                <Monitor className="h-16 w-16 text-white/20" />
              ) : (
                <Gamepad2 className="h-16 w-16 text-white/20" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gameedge-dark-900/90 via-transparent to-transparent" />
            
            {/* Platform Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant={game.platform === 'pc' ? 'default' : 'secondary'}>
                {game.platform.toUpperCase()}
              </Badge>
            </div>

            {/* Rating */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-gameedge-warning text-gameedge-warning" />
              <span className="text-xs font-medium text-white">{game.rating.toFixed(1)}</span>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-semibold text-white text-sm line-clamp-2">{game.name}</h3>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <Badge variant="outline" className="text-xs capitalize">
              {game.genre.replace('_', ' ')}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {game.reviewCount} reviews
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
}

export function GameGrid({ games, isLoading }: GameGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No games found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

interface GameSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GameSearch({ value, onChange, placeholder = 'Search games...' }: GameSearchProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gameedge-primary focus:border-transparent"
      />
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={cn(
            'transition-colors',
            interactive && 'cursor-pointer hover:scale-110',
            !interactive && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              i < rating
                ? 'fill-gameedge-warning text-gameedge-warning'
                : 'text-white/20'
            )}
          />
        </button>
      ))}
    </div>
  );
}
