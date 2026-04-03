'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, Star, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gigs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = ['React Developer', 'Logo Design', 'Video Editor', 'Content Writer', 'App Design'];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-sm rounded-full px-4 py-2 mb-8 border border-primary/30"
        >
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">2,400+</span> verified student freelancers ready to work
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-black leading-tight mb-6"
        >
          Hire{' '}
          <span className="gradient-text glow-text">Brilliant</span>
          <br />
          Student Talent
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Connect with verified college students offering quality freelance services — web development, design, content, and more. All with <span className="text-text-primary font-medium">secure escrow payments</span>.
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="flex items-center gap-2 glass rounded-2xl p-2 max-w-2xl mx-auto mb-6 border border-border focus-within:border-primary/50 focus-within:shadow-glow-sm transition-all duration-300"
        >
          <Search className="w-5 h-5 text-text-muted ml-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a service... e.g. React Developer"
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm outline-none py-2"
          />
          <button
            type="submit"
            className="btn-primary text-sm !py-2.5 !px-5 flex-shrink-0"
          >
            Search
          </button>
        </motion.form>

        {/* Popular searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-14"
        >
          <span className="text-xs text-text-muted">Popular:</span>
          {popularSearches.map((q) => (
            <Link
              key={q}
              href={`/gigs?q=${encodeURIComponent(q)}`}
              className="text-xs px-3 py-1.5 glass-sm rounded-full text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
            >
              {q}
            </Link>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/gigs" className="btn-primary flex items-center gap-2 text-base">
            Browse All Gigs <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register?role=student" className="btn-secondary flex items-center gap-2 text-base">
            <Zap className="w-4 h-4" /> Join as a Student
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary"
        >
          {[
            { icon: Shield, text: 'ID Verified Students' },
            { icon: Star, text: '4.9/5 Avg. Rating' },
            { icon: Zap, text: 'Secure Escrow Payments' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
