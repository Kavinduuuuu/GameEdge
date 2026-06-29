'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Monitor, Gamepad2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/games/GameCard';
import { ReviewCard, ReviewForm } from '@/components/games/ReviewCard';
import { GameCard } from '@/components/games/GameCard';
import { useAuth } from '@/providers/AuthProvider';
import type { Game, Review } from '@/types';

const MOCK_GAMES: Game[] = [
  { id: '1', name: 'Valorant', platform: 'pc', genre: 'fps', coverImage: '', description: 'A tactical 5v5 shooter where precise gunplay meets unique agent abilities. Two teams of 5 play against each other over multiple rounds, with one team attacking and the other defending. Buy weapons and agents abilities at the start of each round.', rating: 4.8, reviewCount: 234, releaseYear: 2020, developer: 'Riot Games' },
  { id: '2', name: 'Counter-Strike 2', platform: 'pc', genre: 'fps', coverImage: '', description: 'The next evolution of Counter-Strike with responsive smokes, sub-tick updates, and new maps.', rating: 4.7, reviewCount: 567, releaseYear: 2023, developer: 'Valve' },
  { id: '3', name: 'FIFA 24', platform: 'ps5', genre: 'sports', coverImage: '', description: 'The world\'s game, powered by HyperMotion technology for the most realistic football experience.', rating: 4.6, reviewCount: 189, releaseYear: 2023, developer: 'EA Sports' },
  { id: '4', name: 'League of Legends', platform: 'pc', genre: 'moba', coverImage: '', description: 'A fast-paced, competitive online game that blends the speed and intensity of an RTS with RPG elements.', rating: 4.5, reviewCount: 456, releaseYear: 2009, developer: 'Riot Games' },
  { id: '5', name: 'Spider-Man 2', platform: 'ps5', genre: 'rpg', coverImage: '', description: 'Swing through New York City as Peter Parker and Miles Morales in this open-world action game.', rating: 4.9, reviewCount: 127, releaseYear: 2023, developer: 'Insomniac Games' },
];

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', gameId: '1', userId: 'u1', userName: 'GamerPro99', rating: 5, comment: 'Best FPS I\'ve played in years. The agent abilities add so much depth to the tactical gameplay. Highly recommend playing at GameEdge on the RTX rigs!', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'r2', gameId: '1', userId: 'u2', userName: 'NightOwl', rating: 4, comment: 'Great game, smooth performance on the gaming PCs. The 240Hz monitors make a huge difference in competitive play.', createdAt: '2024-01-10T14:20:00Z' },
  { id: 'r3', gameId: '1', userId: 'u3', userName: 'TacticalShark', rating: 5, comment: 'Perfect setup for ranked sessions. Low latency, great peripherals, and the cafe atmosphere is unbeatable.', createdAt: '2024-01-05T18:45:00Z' },
];

export default function GameDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const gameId = params.id as string;
  const game = MOCK_GAMES.find((g) => g.id === gameId) || MOCK_GAMES[0];
  const reviews = MOCK_REVIEWS;

  const relatedGames = MOCK_GAMES.filter(
    (g) => g.id !== game.id && (g.genre === game.genre || g.platform === game.platform)
  ).slice(0, 4);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Review submitted:', { rating, comment });
    setShowReviewForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/games">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
      </Link>

      {/* Game Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Cover Art */}
        <div className="md:col-span-1">
          <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gameedge-dark-700 to-gameedge-dark-800 overflow-hidden border border-white/10 flex items-center justify-center">
            {game.platform === 'pc' ? (
              <Monitor className="h-24 w-24 text-white/20" />
            ) : (
              <Gamepad2 className="h-24 w-24 text-white/20" />
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={game.platform === 'pc' ? 'default' : 'secondary'}>
              {game.platform.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {game.genre.replace('_', ' ')}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {game.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={Math.round(game.rating)} size="lg" />
            <span className="text-lg font-semibold text-foreground">{game.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({game.reviewCount} reviews)</span>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {game.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Developer</span>
              <p className="text-foreground font-medium">{game.developer}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Release Year</span>
              <p className="text-foreground font-medium">{game.releaseYear}</p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/booking">
              <Button size="lg">Book a Station to Play</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                gameId={game.id}
                isLoggedIn={isAuthenticated}
                onSubmit={handleReviewSubmit}
                onLoginRequired={() => window.location.href = '/auth/login'}
              />
            </div>
          )}

          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="text-foreground font-medium">{game.platform.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Genre</span>
                <span className="text-foreground font-medium capitalize">{game.genre.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="text-foreground font-medium">{game.rating.toFixed(1)}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="text-foreground font-medium">{game.reviewCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
