'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Gamepad2, Bell } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useCafeStatus } from '@/hooks/useCafeStatus';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { status, isLive } = useCafeStatus();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'Games' },
    { href: '/booking', label: 'Book Now' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gameedge-dark-900/95 backdrop-blur supports-[backdrop-filter]:bg-gameedge-dark-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-gameedge-primary" />
            <span className="text-xl font-bold text-foreground">
              Game<span className="text-gameedge-primary">Edge</span>
            </span>
            <span className="hidden sm:inline-flex items-center ml-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full mr-1.5',
                  status.isOpen ? 'bg-gameedge-success animate-pulse' : 'bg-gameedge-danger'
                )}
              />
              <span className="text-xs text-muted-foreground">
                {status.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-gameedge-primary/10 text-gameedge-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Connection indicator */}
            <div className="hidden sm:flex items-center mr-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  isLive ? 'bg-gameedge-success' : 'bg-gameedge-warning animate-pulse'
                )}
                title={isLive ? 'Connected' : 'Reconnecting...'}
              />
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    {user?.name || 'Dashboard'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-gameedge-primary/10 text-gameedge-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 mt-2">
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="w-full">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
