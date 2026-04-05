'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const stats = [
  { value: '2.4K+', label: 'Elite Students', detail: 'Verified by Admins' },
  { value: '8.5K', label: 'Projects Shipped', detail: 'Across 150+ Categories' },
  { value: '98%', label: 'Success Rate', detail: 'Client Satisfaction' },
  { value: '$1.2M', label: 'Student Earnings', detail: 'Paid Securely via Escrow' },
];

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-block', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 border-y border-border bg-[#09090b] relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-border">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-block md:px-8 first:pl-0 flex flex-col justify-center">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{stat.value}</h3>
            <p className="text-base font-medium text-text-primary mb-1">{stat.label}</p>
            <p className="text-sm text-text-muted">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
