'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Clock, Users, IndianRupee, Filter, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate, GIG_CATEGORIES } from '@/lib/utils';

const STATUS_OPTIONS = ['open', 'closed', 'judging', 'completed'];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('open');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ status });
    if (category) params.set('category', category);
    api.get(`/challenges?${params}`)
      .then((res) => {
        setChallenges(res.data.challenges || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [status, category]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-warning text-sm font-semibold tracking-wide uppercase">Bounty Challenges</span>
            </div>
            <h1 className="section-title">Open Challenges</h1>
            <p className="section-subtitle">Compete with your skills and win real rewards from companies</p>
          </div>
          <Link href="/challenges/create" className="btn-primary flex items-center gap-2 flex-shrink-0">
            <Trophy className="w-4 h-4" /> Post Challenge
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Status tabs */}
          <div className="flex gap-1 p-1 glass rounded-xl border border-border">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  status === s ? 'bg-primary text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass border border-border text-text-secondary text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
            >
              <option value="">All Categories</option>
              {GIG_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-surface text-text-primary">{c.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🏆</p>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No challenges yet</h3>
            <p className="text-text-secondary">Be the first to post a challenge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((ch, i) => (
              <motion.div
                key={ch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/challenges/${ch._id}`}>
                  <div className="group glass rounded-2xl border border-border p-6 card-hover h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-11 h-11 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-warning/20 group-hover:border-warning/40 transition-all">
                        <Trophy className="w-5 h-5 text-warning" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted">Reward</p>
                        <p className="text-lg font-bold text-success">{formatPrice(ch.reward)}</p>
                      </div>
                    </div>

                    {/* Company */}
                    <p className="text-xs text-text-muted mb-1">{ch.createdBy?.companyDetails?.companyName || ch.createdBy?.name}</p>

                    {/* Title */}
                    <h3 className="font-semibold text-text-primary leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                      {ch.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4">{ch.description}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border mt-auto">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {ch.submissions?.length || 0} submissions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(ch.deadline)}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3">
                      <span className={`badge text-xs ${
                        ch.status === 'open' ? 'bg-success/10 text-success border-success/20' :
                        ch.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-warning/10 text-warning border-warning/20'
                      } border`}>
                        {ch.status}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
