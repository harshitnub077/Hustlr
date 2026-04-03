'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Clock, Users, IndianRupee, Send, ExternalLink, Crown } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, getInitials } from '@/lib/utils';

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/challenges/${id}`)
      .then((res) => {
        const ch = res.data.challenge;
        setChallenge(ch);
        if (user && ch.submissions?.some((s: any) => s.userId?._id === user._id)) {
          setSubmitted(true);
        }
      })
      .catch(() => router.push('/challenges'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      await api.post(`/challenges/${id}/submit`, { submissionUrl, note: submissionNote });
      setSubmitted(true);
      setChallenge((prev: any) => ({
        ...prev,
        submissions: [...(prev.submissions || []), { userId: user, submissionUrl }],
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePickWinner = async (winnerId: string) => {
    try {
      await api.patch(`/challenges/${id}/winner`, { winnerId });
      setChallenge((prev: any) => ({ ...prev, winnerId, status: 'completed' }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to pick winner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="skeleton h-10 w-1/2 rounded-xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 skeleton h-96 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  const isCreator = user?._id === challenge.createdBy?._id;
  const isOpen = challenge.status === 'open' && new Date(challenge.deadline) > new Date();
  const winner = challenge.submissions?.find((s: any) => s.userId?._id === challenge.winnerId);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/challenges" className="flex items-center gap-2 text-text-secondary hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Challenges
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border p-7">
              {/* Status */}
              <span className={`badge text-xs mb-4 inline-block ${
                challenge.status === 'open' ? 'bg-success/10 text-success border-success/20' :
                challenge.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                'bg-warning/10 text-warning border-warning/20'
              } border capitalize`}>
                {challenge.status}
              </span>

              {/* Title */}
              <h1 className="font-display text-3xl font-bold text-text-primary mb-3">{challenge.title}</h1>

              {/* Posted by */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {getInitials(challenge.createdBy?.companyDetails?.companyName || challenge.createdBy?.name || 'C')}
                </div>
                <p className="text-sm text-text-secondary">
                  Posted by <span className="text-text-primary font-medium">{challenge.createdBy?.companyDetails?.companyName || challenge.createdBy?.name}</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold text-text-primary mb-3">Description</h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">{challenge.description}</p>
              </div>
            </motion.div>

            {/* Winner banner */}
            {challenge.status === 'completed' && winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl border border-warning/40 bg-warning/5 p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-warning font-semibold">🏆 Challenge Winner</p>
                  <p className="text-text-primary font-medium mt-0.5">{winner.userId?.name}</p>
                  <p className="text-text-muted text-sm">Rewarded {formatPrice(challenge.reward)}</p>
                </div>
              </motion.div>
            )}

            {/* Submissions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-border p-6"
            >
              <h2 className="font-semibold text-text-primary mb-4">
                Submissions ({challenge.submissions?.length || 0})
              </h2>
              {(challenge.submissions?.length || 0) === 0 ? (
                <p className="text-text-muted text-sm text-center py-6">No submissions yet — be the first!</p>
              ) : (
                <div className="space-y-3">
                  {challenge.submissions?.map((sub: any) => {
                    const isWinner = sub.userId?._id === challenge.winnerId;
                    return (
                      <div
                        key={sub._id}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          isWinner ? 'bg-warning/5 border-warning/30' : 'bg-surface border-border'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {getInitials(sub.userId?.name || 'U')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-text-primary">{sub.userId?.name}</p>
                            {isWinner && <Crown className="w-3.5 h-3.5 text-warning" />}
                          </div>
                          {sub.note && <p className="text-xs text-text-muted truncate">{sub.note}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {sub.submissionUrl && (
                            <a href={sub.submissionUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary-light flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          )}
                          {isCreator && challenge.status !== 'completed' && (
                            <button
                              onClick={() => handlePickWinner(sub.userId?._id)}
                              className="text-xs px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-lg hover:bg-warning/20 transition-all"
                            >
                              Pick Winner
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Submit Form */}
            {!isCreator && user?.role === 'student' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl border border-border p-6"
              >
                <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> Submit Your Work
                </h2>
                {submitted ? (
                  <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20">
                    <span className="text-success text-xl">✅</span>
                    <div>
                      <p className="text-success font-semibold">Submission Received!</p>
                      <p className="text-text-muted text-sm">Good luck! The company will review and announce a winner.</p>
                    </div>
                  </div>
                ) : !isOpen ? (
                  <p className="text-warning text-sm">⏰ This challenge is no longer accepting submissions.</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Submission URL</label>
                      <input
                        id="submission-url"
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="input-base"
                        placeholder="https://github.com/yourrepo or Drive link"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Note (optional)</label>
                      <textarea
                        value={submissionNote}
                        onChange={(e) => setSubmissionNote(e.target.value)}
                        className="input-base resize-none"
                        rows={3}
                        placeholder="Describe your approach or any additional context..."
                      />
                    </div>
                    <button
                      id="submit-challenge-btn"
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <Send className="w-4 h-4" />}
                      Submit Entry
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="glass rounded-2xl border border-border p-6">
              <div className="text-center mb-5 pb-5 border-b border-border">
                <p className="text-text-muted text-sm mb-1">Total Reward</p>
                <p className="font-display text-4xl font-black text-success">{formatPrice(challenge.reward)}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Deadline
                  </span>
                  <span className={`font-medium ${new Date(challenge.deadline) < new Date() ? 'text-danger' : 'text-text-primary'}`}>
                    {formatDate(challenge.deadline)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Submissions
                  </span>
                  <span className="text-text-primary">{challenge.submissions?.length || 0}</span>
                </div>
              </div>
            </div>

            {isOpen && !isCreator && !submitted && user?.role === 'student' && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-sm text-text-secondary">
                <p className="font-medium text-primary mb-1">💡 Pro Tips</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Read the requirements carefully</li>
                  <li>Include a live demo link if possible</li>
                  <li>Add context to improve your chances</li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
