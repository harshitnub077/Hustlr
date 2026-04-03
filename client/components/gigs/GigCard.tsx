'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';
import { cn, formatPrice, GIG_CATEGORIES } from '@/lib/utils';
import { Clock, ShoppingCart } from 'lucide-react';

interface Gig {
  _id: string;
  title: string;
  category: string;
  price: number;
  deliveryTimeDays: number;
  images: string[];
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  sellerId: {
    _id: string;
    name: string;
    profile: { avatarUrl?: string; premiumBadge?: boolean };
    averageRating?: number;
  };
}

interface GigCardProps {
  gig: Gig;
  className?: string;
}

export default function GigCard({ gig, className }: GigCardProps) {
  const categoryInfo = GIG_CATEGORIES.find((c) => c.value === gig.category);
  const sellerInitials = gig.sellerId.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/gigs/${gig._id}`}>
      <div
        className={cn(
          'group relative glass rounded-2xl overflow-hidden border border-border card-hover cursor-pointer',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-44 bg-surface-3 overflow-hidden">
          {gig.images?.[0] ? (
            <img
              src={gig.images[0]}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-surface-2 to-surface-3">
              {categoryInfo?.icon || '💼'}
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge bg-background/80 backdrop-blur-sm text-text-secondary border border-border text-xs">
              {categoryInfo?.icon} {categoryInfo?.label || gig.category}
            </span>
          </div>
          {/* Premium badge */}
          {gig.sellerId?.profile?.premiumBadge && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-warning/20 text-warning border border-warning/30">
                ⭐ Premium
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Seller info */}
          <div className="flex items-center gap-2 mb-3">
            {gig.sellerId?.profile?.avatarUrl ? (
              <img
                src={gig.sellerId.profile.avatarUrl}
                alt={gig.sellerId.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                {sellerInitials}
              </div>
            )}
            <span className="text-xs text-text-secondary font-medium">{gig.sellerId?.name}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3">
            {gig.title}
          </h3>

          {/* Rating */}
          {gig.totalReviews > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              <span className="text-xs font-semibold text-warning">{gig.averageRating.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({gig.totalReviews})</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Clock className="w-3.5 h-3.5" />
              <span>{gig.deliveryTimeDays}d delivery</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted">Starting at</p>
              <p className="text-base font-bold text-text-primary">{formatPrice(gig.price)}</p>
            </div>
          </div>
        </div>

        {/* Hover shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}
