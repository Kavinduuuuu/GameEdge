'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gameedge-dark-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-gameedge-primary" />
              <span className="text-xl font-bold text-foreground">
                Game<span className="text-gameedge-primary">Edge</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              The ultimate gaming cafe experience. Premium gaming stations, competitive rates,
              and a community of passionate gamers. Book your station and dominate the leaderboards.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                  Browse Games
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                  Book a Station
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-gameedge-primary transition-colors">
                  Join Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Gaming Street</li>
              <li>Tech District, CA 90210</li>
              <li className="text-gameedge-primary">hello@gameedge.gg</li>
              <li className="text-gameedge-primary">(555) 123-4567</li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Hours: 10:00 AM - 11:00 PM Daily</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GameEdge e-Sports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
