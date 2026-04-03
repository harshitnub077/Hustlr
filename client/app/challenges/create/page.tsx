'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { GIG_CATEGORIES } from '@/lib/utils';

export default function CreateChallengePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'company') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!category) { setError('Please select a category'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/challenges', { title, description, reward: Number(reward), deadline, category });
      router.push(`/challenges/${data.challenge._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link href="/dashboard/company" className="flex items-center gap-2 text-text-secondary hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-warning" />
            <span className="text-warning text-sm font-semibold">New Challenge</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Post a Challenge</h1>
          <p className="text-text-secondary mt-2">Offer a reward for students to compete and solve your problem</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-border p-7 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Challenge Title <span className="text-danger">*</span>
              </label>
              <input
                id="challenge-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-base"
                placeholder="e.g. Build a landing page for our SaaS product"
                maxLength={150}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                id="challenge-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="input-base resize-none"
                placeholder="Describe the challenge requirements, expected output, judging criteria..."
                maxLength={5000}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Reward (₹) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="challenge-reward"
                    type="number"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="input-base pl-10"
                    placeholder="5000"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Deadline <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="challenge-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input-base pl-10 [color-scheme:dark]"
                    min={minDate.toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Category <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GIG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all ${
                      category === cat.value
                        ? 'bg-primary/15 border-primary/50 text-primary'
                        : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="glass rounded-2xl border border-border p-5 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="font-medium text-text-primary mb-1">How it works</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Students submit their solutions before the deadline</li>
                <li>You review all submissions at your own pace</li>
                <li>Pick a winner — they receive the reward amount</li>
                <li>Reward transfer is managed off-platform for now</li>
              </ul>
            </div>
          </div>

          <button
            id="create-challenge-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-base !py-4 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Trophy className="w-5 h-5" /> Post Challenge</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
