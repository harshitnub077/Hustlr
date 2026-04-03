'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Search, CreditCard, Star, UserCheck, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Discover',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    points: [
      'Search hundreds of gigs across 10+ categories',
      'Filter by price, rating, and delivery time',
      'Read seller profiles and view portfolios',
      'Check ratings from previous buyers',
    ],
  },
  {
    step: '02',
    icon: UserCheck,
    title: 'Choose a Verified Student',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    points: [
      'All students are ID-verified by our admin team',
      'College email and ID card validation',
      'Only approved students can post gigs',
      'Premiumm badge for top-rated sellers',
    ],
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Secure Escrow Payment',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    points: [
      'Pay securely — funds held in escrow',
      'Money only released when you approve delivery',
      'Full refund if order is cancelled before delivery',
      'Transparent payment status at every step',
    ],
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'Receive & Review',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    points: [
      'Get work delivered directly in the platform',
      'Chat with your seller in real-time',
      'Leave a review to help future buyers',
      'Build lasting relationships with student talent',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-sm rounded-full px-4 py-2 mb-6 border border-primary/30">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Simple Process</span>
          </div>
          <h1 className="font-display text-5xl font-black text-text-primary mb-4">
            How <span className="gradient-text">Hustlr</span> Works
          </h1>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed">
            From discovery to delivery — a transparent, secure process built for students and companies alike.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`glass rounded-3xl border ${section.border} p-8 gradient-border`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className={`w-16 h-16 ${section.bg} rounded-2xl flex items-center justify-center flex-shrink-0 border ${section.border}`}>
                    <Icon className={`w-8 h-8 ${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`font-display text-4xl font-black ${section.color} opacity-30`}>{section.step}</span>
                      <h2 className="font-display text-2xl font-bold text-text-primary">{section.title}</h2>
                    </div>
                    <ul className="space-y-2">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-text-secondary text-sm">
                          <CheckCircle className={`w-4 h-4 ${section.color} flex-shrink-0 mt-0.5`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-10">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Admin Verified', desc: 'Every student account is verified with college ID before posting gigs.', color: 'text-primary' },
              { icon: Zap, title: 'Real-time Chat', desc: 'Communicate with sellers via built-in Socket.io powered chat.', color: 'text-accent' },
              { icon: Star, title: 'Review System', desc: 'Build trust through transparent ratings and reviews after every completed order.', color: 'text-warning' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass rounded-2xl border border-border p-6 text-center">
                <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
                <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-4">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gigs" className="btn-primary flex items-center gap-2">
              Browse Gigs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register" className="btn-secondary">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
