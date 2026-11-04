'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Monitor, Gamepad2, CircleDot, ChevronRight, Zap, Trophy, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CafeStatusBadge, OccupancyBar } from '@/components/status/CafeStatusBadge';
import { GameCard } from '@/components/games/GameCard';
import { useCafeStatus } from '@/hooks/useCafeStatus';
import { useAuth } from '@/providers/AuthProvider';
import { MOCK_GAMES } from '@/data/mockGames';

// Featured games: mockGames.ts walin ids walata anuwa
const FEATURED_IDS = ['1', '3', '4', '6', '8', '9'];
const FEATURED_GAMES = FEATURED_IDS
  .map((id) => MOCK_GAMES.find((g) => g.id === id))
  .filter((g): g is NonNullable<typeof g> => Boolean(g));

const quickActions = [
  { title: 'Book a PC', description: 'RTX 4070, 240Hz', icon: Monitor, href: '/booking', color: 'text-gameedge-primary' },
  { title: 'Book a PS5', description: '55" 4K, 2 controllers', icon: Gamepad2, href: '/booking', color: 'text-gameedge-secondary' },
  { title: 'Book a Pool Table', description: 'Tournament quality', icon: CircleDot, href: '/booking', color: 'text-gameedge-success' },
];

// ============================================================
// PRICING (Rs.): mila wenas karanna ona nam methana witharak wenas karanna
// ============================================================
const PRICING = [
  {
    title: 'Gaming PC',
    subtitle: 'RTX 4070 · 240Hz monitor',
    icon: Monitor,
    color: 'text-gameedge-primary',
    rates: [
      { label: '1 hour', price: 400 },
      { label: '5 hours', price: 1750, note: 'Save Rs. 250' },
    ],
  },
  {
    title: 'PS5',
    subtitle: '55" 4K · DualSense controllers',
    icon: Gamepad2,
    color: 'text-gameedge-secondary',
    rates: [
      { label: '1 player · 1 hour', price: 800 },
      { label: '2 players · 1 hour', price: 1200 },
      { label: '3 players · 1 hour', price: 1600 },
      { label: '4 players · 1 hour', price: 2000 },
    ],
  },
  {
    title: 'PS4',
    subtitle: 'Classic couch gaming',
    icon: Gamepad2,
    color: 'text-gameedge-primary',
    rates: [
      { label: '1 player · 1 hour', price: 500 },
      { label: '2 players · 1 hour', price: 800 },
      { label: '3 players · 1 hour', price: 1000 },
      { label: '4 players · 1 hour', price: 1200 },
    ],
  },
  {
    title: 'Racing Simulator',
    subtitle: 'Wheel, pedals & racing seat',
    icon: Car,
    color: 'text-gameedge-warning',
    rates: [
      { label: '30 minutes', price: 500 },
      { label: '1 hour', price: 1000 },
    ],
  },
  {
    title: 'Pool Table',
    subtitle: 'Tournament quality',
    icon: CircleDot,
    color: 'text-gameedge-success',
    rates: [{ label: '1 hour', price: 1000 }],
  },
];

// Real numbers: seed data eke thiyena ewa (20 PCs + 5 PS5s + 3 Pool Tables = 28)
const stats = [
  { label: 'Gaming Stations', value: '28', icon: Monitor },
  { label: 'High-End PCs', value: '20', icon: Monitor },
  { label: 'PS5 Consoles', value: '5', icon: Gamepad2 },
  { label: 'Games Available', value: String(MOCK_GAMES.length), icon: Trophy },
];

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US')}`;
}

// public/hero.png thiyenawa nam penawa, nathnam gradient eka witharai
function HeroBackground() {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hero.png"
      alt=""
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover opacity-100"
    />
  );
}

export default function HomePage() {
  const { status } = useCafeStatus();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gameedge-dark-900 via-gameedge-dark-800 to-gameedge-dark-900" />
        <HeroBackground />
        {/* Dark overlay (light): image eka penna */}
        <div className="absolute inset-0 bg-gradient-to-b from-gameedge-dark-900/35 via-gameedge-dark-900/25 to-gameedge-dark-900" />
        {/* Text pitipasse dark glow (light) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,12,24,0.45),transparent_60%)]" />

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
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]">
              Game<span className="text-gameedge-primary">Edge</span> e-Sports
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              The ultimate gaming cafe experience. Premium stations, competitive rates,
              and a community of passionate gamers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <CafeStatusBadge />
              <span className="text-sm text-gray-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
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
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-black/30 backdrop-blur-sm">
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

      {/* Pricing / Rates */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Pricing & Rates</h2>
          <p className="text-muted-foreground">Simple rates for every kind of gamer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full transition-all duration-300 hover:border-gameedge-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center">
                      <plan.icon className={`h-6 w-6 ${plan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
                      <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
                    </div>
                  </div>

                  <ul className="divide-y divide-white/10 flex-1 mb-6">
                    {plan.rates.map((rate) => (
                      <li key={rate.label} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-muted-foreground">{rate.label}</span>
                        <span className="flex items-center gap-2">
                          {'note' in rate && rate.note && (
                            <Badge variant="outline" className="text-[10px]">{rate.note}</Badge>
                          )}
                          <span className="font-semibold text-foreground">{formatRs(rate.price)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/booking">
                    <Button variant="outline" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          All prices are in Sri Lankan Rupees (Rs.). PS4 and PS5 rates are for the whole group, per hour.
        </p>
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

      {/* CTA Section: login wela nam Book Now, nathnam Create Account */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-gameedge-primary/10 to-gameedge-secondary/10 border-gameedge-primary/20">
            <CardContent className="pt-8 pb-8">
              <Trophy className="h-12 w-12 text-gameedge-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Game?</h2>
              <p className="text-muted-foreground mb-6">
                {isAuthenticated
                  ? 'Pick your station and lock in your next session. Premium gaming with zero lag.'
                  : 'Join gamers at GameEdge. Book your station now and experience premium gaming with zero lag.'}
              </p>
              <Link href={isAuthenticated ? '/booking' : '/auth/register'}>
                <Button size="lg">
                  {isAuthenticated ? 'Book Now' : 'Create Free Account'}
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