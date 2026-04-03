'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star, Clock, ShoppingCart, CheckCircle, User, Calendar,
  ArrowLeft, Share2, Flag, Shield
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate, GIG_CATEGORIES, getInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function GigDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [gig, setGig] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/gigs/${id}`),
      api.get(`/reviews/gig/${id}`),
    ])
      .then(([gigRes, reviewRes]) => {
        setGig(gigRes.data.gig);
        setReviews(reviewRes.data.reviews || []);
      })
      .catch(() => router.push('/gigs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOrder = async () => {
    if (!user) return router.push('/login');
    setOrdering(true);
    try {
      await api.post('/orders', { gigId: id, requirements });
      router.push('/dashboard/student?tab=orders');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-10 w-3/4 rounded-xl" />
            <div className="skeleton h-80 rounded-2xl" />
            <div className="skeleton h-40 rounded-2xl" />
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!gig) return null;

  const categoryInfo = GIG_CATEGORIES.find((c) => c.value === gig.category);
  const seller = gig.sellerId;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/gigs" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Browse Gigs
          </Link>
          <span>/</span>
          <span className="text-text-muted">{categoryInfo?.label}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-primary/10 text-primary border border-primary/20">
                  {categoryInfo?.icon} {categoryInfo?.label}
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold text-text-primary leading-tight">{gig.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary">
                {gig.totalReviews > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-warning font-semibold">{gig.averageRating.toFixed(1)}</span>
                    <span>({gig.totalReviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{gig.totalOrders} orders</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {gig.images?.length > 0 ? (
              <div>
                <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-surface-2">
                  <img
                    src={gig.images[activeImage]}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {gig.images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {gig.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage === i ? 'border-primary' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-72 rounded-2xl bg-surface-2 flex items-center justify-center text-7xl">
                {categoryInfo?.icon}
              </div>
            )}

            {/* Seller Info */}
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4">About the Seller</h2>
              <div className="flex items-start gap-4">
                {seller?.profile?.avatarUrl ? (
                  <img src={seller.profile.avatarUrl} alt={seller.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-xl font-bold text-primary">
                    {getInitials(seller?.name || 'U')}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary">{seller?.name}</h3>
                    {seller?.profile?.premiumBadge && (
                      <span className="badge bg-warning/15 text-warning border border-warning/30 text-xs">⭐ Premium</span>
                    )}
                  </div>
                  {seller?.averageRating > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="text-sm text-warning font-semibold">{seller.averageRating}</span>
                      <span className="text-xs text-text-muted">({seller.totalReviews} reviews)</span>
                    </div>
                  )}
                  {seller?.profile?.bio && (
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">{seller.profile.bio}</p>
                  )}
                  {seller?.profile?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {seller.profile.skills.slice(0, 6).map((skill: string) => (
                        <span key={skill} className="text-xs px-2.5 py-1 glass-sm rounded-full text-text-secondary border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4">About this Gig</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">{gig.description}</p>
              {gig.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {gig.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-3 py-1 glass-sm rounded-full text-primary border border-primary/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 className="font-semibold text-text-primary text-xl mb-5">
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass rounded-xl border border-border p-5">
                      <div className="flex items-start gap-3 mb-3">
                        {review.reviewerId?.profile?.avatarUrl ? (
                          <img src={review.reviewerId.profile.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                            {getInitials(review.reviewerId?.name || 'U')}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{review.reviewerId?.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'fill-warning text-warning' : 'text-border'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-text-muted">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Order Card (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="glass rounded-3xl border border-border p-6 shadow-card">
              <div className="mb-5">
                <p className="text-text-secondary text-sm">Starting at</p>
                <p className="font-display text-4xl font-black text-text-primary">{formatPrice(gig.price)}</p>
              </div>

              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{gig.deliveryTimeDays} day{gig.deliveryTimeDays > 1 ? 's' : ''} delivery</span>
                </div>
              </div>

              {user?.role !== 'student' || user?._id !== seller?._id ? (
                <>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe your requirements for the seller..."
                    rows={4}
                    className="input-base resize-none text-sm mb-4"
                  />
                  <button
                    id="order-gig-btn"
                    onClick={handleOrder}
                    disabled={ordering}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 text-base"
                  >
                    {ordering ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><ShoppingCart className="w-5 h-5" /> Place Order</>
                    )}
                  </button>

                  <div className="flex items-center gap-2 mt-4 text-xs text-text-muted">
                    <Shield className="w-3.5 h-3.5 text-success" />
                    <span>Payment held in escrow until delivery</span>
                  </div>
                </>
              ) : (
                <Link href={`/dashboard/student`} className="btn-secondary w-full text-center">
                  Manage Your Gig
                </Link>
              )}

              <div className="flex items-center justify-center gap-4 mt-5 text-xs text-text-muted">
                <button className="flex items-center gap-1 hover:text-text-secondary transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button className="flex items-center gap-1 hover:text-danger transition-colors">
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
