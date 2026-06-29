'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Gamepad2, CircleDot, ChevronRight, Zap, Trophy, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CafeStatusBadge, OccupancyBar } from '@/components/status/CafeStatusBadge';
import { GameCard } from '@/components/games/GameCard';
import { useCafeStatus } from '@/hooks/useCafeStatus';
import type { Game } from '@/types';

const FEATURED_GAMES: Game[] = [
  { id: '1', name: 'Valorant', platform: 'pc', genre: 'fps', coverImage: '', description: 'Tactical 5v5 shooter', rating: 4.8, reviewCount: 234, releaseYear: 2020, developer: 'Riot Games' },
  { id: '2', name: 'FIFA 24', platform: 'ps5', genre: 'sports', coverImage: '', description: 'World\'s game', rating: 4.6, reviewCount: 189, releaseYear: 2023, developer: 'EA Sports' },
  { id: '3', name: 'League of Legends', platform: 'pc', genre: 'moba', coverImage: '', description: '5v5 MOBA', rating: 4.5, reviewCount: 456, releaseYear: 2009, developer: 'Riot Games' },
  { id: '4', name: 'Spider-Man 2', platform: 'ps5', genre: 'rpg', coverImage: '', description: 'Open-world action', rating: 4.9, reviewCount: 127, releaseYear: 2023, developer: 'Insomniac' },
  { id: '5', name: 'Fortnite', platform: 'pc', genre: 'battle_royale', coverImage: '', description: '100-player battle royale', rating: 4.4, reviewCount: 567, releaseYear: 2017, developer: 'Epic Games' },
  { id: '6', name: 'Street Fighter 6', platform: 'ps5', genre: 'fighting', coverImage: '', description: 'Competitive fighting', rating: 4.7, reviewCount: 98, releaseYear: 2023, developer: 'Capcom' },
];

const quickActions = [
  { title: 'Book a PC', description: 'RTX 4070, 240Hz', icon: Monitor, href: '/booking', color: 'text-gameedge-primary' },
  { title: 'Book a PS5', description: '55" 4K, 2 controllers', icon: Gamepad2, href: '/booking', color: 'text-gameedge-secondary' },
  { title: 'Book a Pool Table', description: 'Tournament quality', icon: CircleDot, href: '/booking', color: 'text-gameedge-success' },
];

const stats = [
  { label: 'Gaming Stations', value: '28', icon: Monitor },
  { label: 'Active Players', value: '1.2K+', icon: Users },
  { label: 'Games Available', value: '150+', icon: Trophy },
  { label: 'Uptime', value: '99.9%', icon: Zap },
];

export default function HomePage() {
  const { status } = useCafeStatus();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gameedge-dark-900 via-gameedge-dark-800 to-gameedge-dark-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="default" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Live Now
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Game<span className="text-gameedge-primary">Edge</span> e-Sports
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The ultimate gaming cafe experience. Premium stations, competitive rates,
              and a community of passionate gamers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <CafeStatusBadge />
              <span className="text-sm text-muted-foreground">
                {status.openingTime} - {status.closingTime} Daily
              </span>
            </div>

            <OccupancyBar />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto">
                  Book a Station
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Games
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Book</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={action.href}>
                <Card className="group h-full transition-all duration-300 hover:border-gameedge-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gameedge-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-8 w-8 text-gameedge-primary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Games</h2>
          <Link href="/games">
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-gameedge-primary/10 to-gameedge-secondary/10 border-gameedge-primary/20">
            <CardContent className="pt-8 pb-8">
              <Trophy className="h-12 w-12 text-gameedge-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Game?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of gamers at GameEdge. Book your station now and experience
                premium gaming with zero lag.
              </p>
              <Link href="/auth/register">
                <Button size="lg">
                  Create Free Account
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
