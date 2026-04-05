'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import GigCard from '@/components/gigs/GigCard';
import api from '@/lib/api';

export default function FeaturedGigs() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockGigs = [
      { _id: '1', title: 'I will build a scalable Next.js web application architecture', price: 250, averageRating: 5, totalReviews: 24, deliveryTimeDays: 7, category: 'development', sellerId: { _id: 's1', name: 'Alex C.', profile: { avatarUrl: 'https://i.pravatar.cc/150?img=11', premiumBadge: true } }, images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'] },
      { _id: '2', title: 'I will design a premium SaaS dashboard UI/UX', price: 180, averageRating: 4.9, totalReviews: 42, deliveryTimeDays: 5, category: 'design', sellerId: { _id: 's2', name: 'Sarah J.', profile: { avatarUrl: 'https://i.pravatar.cc/150?img=5', premiumBadge: true } }, images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop'] },
      { _id: '3', title: 'I will engineer high-converting B2B landing pages', price: 95, averageRating: 4.9, totalReviews: 18, deliveryTimeDays: 3, category: 'development', sellerId: { _id: 's3', name: 'Michael T.', profile: { avatarUrl: 'https://i.pravatar.cc/150?img=33' } }, images: ['https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop'] },
      { _id: '4', title: 'I will animate professional 3D motion graphics', price: 130, averageRating: 5, totalReviews: 89, deliveryTimeDays: 6, category: 'video', sellerId: { _id: 's4', name: 'Emma W.', profile: { avatarUrl: 'https://i.pravatar.cc/150?img=47' } }, images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop'] },
    ];

    api
      .get('/gigs?sort=rating&limit=4')
      .then((res) => {
        if (!res.data.gigs || res.data.gigs.length === 0) {
          setGigs(mockGigs);
        } else {
          setGigs(res.data.gigs.slice(0, 4));
        }
      })
      .catch(() => {
        setGigs(mockGigs);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || gigs.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.gig-card-item', {
        y: 40,
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
  }, [loading, gigs]);

  return (
    <section className="py-24 bg-[#09090b] relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={containerRef}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Featured Work
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl font-medium">
              A curated selection of top-rated deliverables produced by our elite student network.
            </p>
          </div>
          <Link href="/gigs" className="btn-secondary shrink-0">
            View All Work
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-2 rounded-xl h-[380px] w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <div key={gig._id} className="gig-card-item h-full">
                <GigCard gig={gig} className="h-full bg-surface-2/30 border-border shadow-sm hover:border-border-bright hover:shadow-lg transition-all rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
