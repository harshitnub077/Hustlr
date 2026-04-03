'use client';

import { motion } from 'framer-motion';
import { UserCheck, Search, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Discover',
    description: 'Explore hundreds of gigs across 10+ categories from verified college students.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Choose Your Student',
    description: 'Review profiles, ratings, and portfolios to find the perfect match for your project.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Secure Payment',
    description: 'Funds are held in escrow — only released when you\'re satisfied with the work.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Get Results',
    description: 'Receive high-quality deliverables, leave a review, and build lasting connections.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle mx-auto">Four simple steps to get quality work done</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass rounded-2xl p-6 border border-border"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-y-1/2 z-0" />
              )}
              <div className={`w-12 h-12 ${step.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <span className="text-4xl font-black text-border absolute top-5 right-6 font-display">
                {step.step}
              </span>
              <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
