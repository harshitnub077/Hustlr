'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/gigs', label: 'Talent Directory' },
  { href: '/challenges', label: 'Bounties' },
  { href: '/how-it-works', label: 'How It Works' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
      scrolled ? "bg-[#09090b]/80 backdrop-blur-md border-border py-4" : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white text-[#09090b] flex items-center justify-center font-black">H</div>
          ustlr
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 bg-surface-2/50 px-6 py-2 rounded-full border border-border backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === link.href ? 'text-white' : 'text-text-secondary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-secondary">{user.name}</span>
              <Link href="/dashboard" className="text-sm font-medium text-white hover:text-text-secondary transition-colors underline underline-offset-4">
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm text-text-muted hover:text-white">Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary pr-4 flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-[#09090b] border-b border-border p-6 md:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-text-secondary hover:text-white w-full py-2 border-b border-border"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-secondary w-full">Dashboard</Link>
                    <button onClick={logout} className="text-left py-2 text-text-muted">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-secondary w-full">Sign In</Link>
                    <Link href="/register" className="btn-primary w-full justify-center">Get Started</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
