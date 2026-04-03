'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '2,400+', label: 'Verified Students' },
  { value: '8,500+', label: 'Gigs Completed' },
  { value: '950+', label: 'Companies Hiring' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-surface/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <p className="font-display text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
