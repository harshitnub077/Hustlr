'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GIG_CATEGORIES } from '@/lib/utils';

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="section-title">Browse by Category</h2>
        <p className="section-subtitle mx-auto">Find exactly what you need from our talented student community</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {GIG_CATEGORIES.filter((c) => c.value !== 'other').map((cat, i) => (
          <motion.div
            key={cat.value}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/gigs?category=${cat.value}`}
              className="group flex flex-col items-center gap-3 p-5 glass rounded-2xl border border-border card-hover text-center"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </span>
              <span className="text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors leading-snug">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
