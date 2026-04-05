'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Code, PenTool, Database, Megaphone, Smartphone, Music, Palette, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'development', label: 'Development', desc: 'Full-stack, Front-end, Smart Contracts.', icon: Code },
  { value: 'design', label: 'UX/UI Design', desc: 'Product, Brand Identity, Motion.', icon: Palette },
  { value: 'video', label: 'Video & Audio', desc: 'Editing, VFX, Sound Design.', icon: Video },
  { value: 'writing', label: 'Copywriting', desc: 'Technical, Marketing, Ghostwriting.', icon: PenTool },
];

export default function CategoryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.category-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 relative bg-[#09090b] z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={containerRef}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Explore Disciplines
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl font-medium">
              Browse top verified talent across our most demanded professional categories.
            </p>
          </div>
          <Link href="/gigs" className="text-sm font-semibold text-white hover:text-text-secondary transition-colors flex items-center gap-2 group shrink-0">
            View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.value}
                href={`/gigs?category=${cat.value}`}
                className="category-card card-premium p-8 group flex flex-col justify-between aspect-square"
              >
                <div className="w-12 h-12 rounded-xl border border-border bg-surface-2 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
