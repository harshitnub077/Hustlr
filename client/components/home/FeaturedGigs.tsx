'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import GigCard from '@/components/gigs/GigCard';
import api from '@/lib/api';

export default function FeaturedGigs() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/gigs?sort=rating&limit=6')
      .then((res) => setGigs(res.data.gigs || []))
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">Top Rated</span>
          </div>
          <h2 className="section-title">Featured Gigs</h2>
          <p className="section-subtitle">Handpicked top-rated services from verified students</p>
        </div>
        <Link href="/gigs" className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-light text-sm font-medium transition-colors">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-72 rounded-2xl" />
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <p className="text-lg">No gigs yet. Be the first to post one!</p>
          <Link href="/gigs/create" className="btn-primary mt-4 inline-block">Create a Gig</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig, i) => (
            <motion.div
              key={gig._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GigCard gig={gig} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
