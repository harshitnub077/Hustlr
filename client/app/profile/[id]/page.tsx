'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, MapPin, Linkedin, Github, ExternalLink, Calendar, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import { formatDate, getInitials, GIG_CATEGORIES } from '@/lib/utils';
import GigCard from '@/components/gigs/GigCard';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/gigs/seller/${id}`),
      api.get(`/reviews/seller/${id}`),
    ])
      .then(([userRes, gigsRes, reviewsRes]) => {
        setProfile(userRes.data.user);
        setGigs(gigsRes.data.gigs || []);
        setReviews(reviewsRes.data.reviews || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-12 w-2/3 rounded-xl" />
            <div className="skeleton h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const skills = profile.profile?.skills || [];
  const avgRating = profile.averageRating || 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card (sticky) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-28 h-fit space-y-4"
          >
            <div className="glass rounded-2xl border border-border p-7 text-center">
              {/* Avatar */}
              {profile.profile?.avatarUrl ? (
                <img
                  src={profile.profile.avatarUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-glow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-4">
                  {getInitials(profile.name)}
                </div>
              )}

              <h1 className="font-display text-xl font-bold text-text-primary">{profile.name}</h1>

              {/* Premium + Role badges */}
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                {profile.profile?.premiumBadge && (
                  <span className="badge bg-warning/10 text-warning border border-warning/20 text-xs">⭐ Premium</span>
                )}
                <span className={`badge text-xs border ${
                  profile.role === 'student' ? 'bg-primary/10 text-primary border-primary/20' :
                  profile.role === 'company' ? 'bg-accent/10 text-accent border-accent/20' :
                  'bg-danger/10 text-danger border-danger/20'
                } capitalize`}>
                  {profile.role}
                </span>
              </div>

              {/* Rating */}
              {avgRating > 0 && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-bold text-warning">{avgRating}</span>
                  <span className="text-text-muted text-sm">({profile.totalReviews} reviews)</span>
                </div>
              )}

              {/* Bio */}
              {profile.profile?.bio && (
                <p className="text-text-secondary text-sm mt-4 leading-relaxed">{profile.profile.bio}</p>
              )}

              {/* Meta */}
              <div className="mt-4 space-y-2 text-sm text-text-secondary">
                {profile.profile?.location && (
                  <div className="flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {profile.profile.location}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(profile.createdAt)}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 mt-5">
                {profile.profile?.linkedIn && (
                  <a href={profile.profile.linkedIn} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 glass-sm rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.profile?.github && (
                  <a href={profile.profile.github} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 glass-sm rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="glass rounded-2xl border border-border p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span key={skill} className="text-xs px-2.5 py-1 glass-sm rounded-full text-text-secondary border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* College info */}
            {profile.role === 'student' && profile.collegeDetails?.collegeName && (
              <div className="glass rounded-2xl border border-border p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Education</h3>
                <p className="text-sm text-text-secondary">🎓 {profile.collegeDetails.collegeName}</p>
                {profile.isApprovedByAdmin && (
                  <p className="text-xs text-success mt-1">✓ Verified Student</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Gigs */}
            {gigs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-display text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Active Gigs ({gigs.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gigs.map((gig) => (
                    <GigCard key={gig._id} gig={{ ...gig, sellerId: profile }} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="font-display text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning" />
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass rounded-xl border border-border p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                          {getInitials(review.reviewerId?.name || 'U')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-text-primary">{review.reviewerId?.name}</p>
                            <span className="text-xs text-text-muted">{formatDate(review.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{review.comment}</p>
                      {review.gigId?.title && (
                        <Link href={`/gigs/${review.gigId._id}`} className="text-xs text-primary hover:text-primary-light mt-2 inline-flex items-center gap-1 transition-colors">
                          <ExternalLink className="w-3 h-3" /> {review.gigId.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {gigs.length === 0 && reviews.length === 0 && (
              <div className="glass rounded-2xl border border-border text-center py-16">
                <p className="text-5xl mb-4">👋</p>
                <p className="text-text-secondary">This user hasn't posted any gigs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
