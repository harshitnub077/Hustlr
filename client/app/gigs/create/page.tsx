'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus, X, Zap } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { GIG_CATEGORIES } from '@/lib/utils';

export default function CreateGigPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTimeDays, setDeliveryTimeDays] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'student') {
    router.push('/login');
    return null;
  }

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.slice(0, 5 - images.length);
    setImages([...images, ...valid]);
    setPreviews([...previews, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!category) { setError('Please select a category'); return; }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('price', price);
      form.append('deliveryTimeDays', deliveryTimeDays);
      form.append('tags', JSON.stringify(tags));
      images.forEach((img) => form.append('images', img));

      const { data } = await api.post('/gigs', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push(`/gigs/${data.gig._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link href="/dashboard/student" className="flex items-center gap-2 text-text-secondary hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary">Create a New Gig</h1>
          <p className="text-text-secondary mt-2">Showcase your skills and start earning</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-border p-7"
          >
            <h2 className="font-semibold text-text-primary mb-5 text-lg">Basic Information</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Gig Title <span className="text-danger">*</span>
                </label>
                <input
                  id="gig-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-base"
                  placeholder="e.g. I will build a modern React web app"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-text-muted mt-1">{100 - title.length} characters remaining</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  id="gig-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="input-base resize-none"
                  placeholder="Describe what you'll deliver, your process, and what makes you unique..."
                  maxLength={3000}
                  required
                />
                <p className="text-xs text-text-muted mt-1">{3000 - description.length} characters remaining</p>
              </div>
            </div>
          </motion.div>

          {/* Pricing & Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-border p-7"
          >
            <h2 className="font-semibold text-text-primary mb-5 text-lg">Pricing & Delivery</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Price (₹) <span className="text-danger">*</span>
                </label>
                <input
                  id="gig-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-base"
                  placeholder="e.g. 1500"
                  min={50}
                  required
                />
                <p className="text-xs text-text-muted mt-1">Minimum ₹50</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Delivery Time (days) <span className="text-danger">*</span>
                </label>
                <input
                  id="gig-delivery"
                  type="number"
                  value={deliveryTimeDays}
                  onChange={(e) => setDeliveryTimeDays(e.target.value)}
                  className="input-base"
                  placeholder="e.g. 3"
                  min={1}
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl border border-border p-7"
          >
            <h2 className="font-semibold text-text-primary mb-2 text-lg">Tags</h2>
            <p className="text-text-muted text-sm mb-4">Add up to 8 keywords to help buyers find your gig</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input-base flex-1 !py-2"
                placeholder="Add a tag and press Enter"
              />
              <button type="button" onClick={addTag} className="btn-secondary !py-2 !px-4 flex-shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 glass-sm rounded-full text-sm text-primary border border-primary/20">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-primary/50 hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-border p-7"
          >
            <h2 className="font-semibold text-text-primary mb-2 text-lg">Portfolio Images</h2>
            <p className="text-text-muted text-sm mb-4">Upload up to 5 images to showcase your work</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-danger/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/5 text-text-muted">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Upload</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              )}
            </div>
          </motion.div>

          <button
            id="create-gig-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-base !py-4 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Zap className="w-5 h-5" /> Publish Gig</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
