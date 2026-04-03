'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import GigCard from '@/components/gigs/GigCard';
import api from '@/lib/api';
import { GIG_CATEGORIES, formatPrice } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function GigsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [gigs, setGigs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('createdAt');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', String(page));
      params.set('limit', '12');

      const { data } = await api.get(`/gigs?${params.toString()}`);
      setGigs(data.gigs || []);
      setTotal(data.total || 0);
    } catch {
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGigs();
  };

  const clearFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('createdAt');
    setQuery('');
    setPage(1);
  };

  const activeFilters = [category, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Browse Gigs</h1>
          <p className="text-text-secondary">
            {loading ? 'Loading...' : `${total.toLocaleString()} services available`}
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-3 border border-border focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gigs..."
              className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-text-muted hover:text-text-secondary">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilters > 0
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'glass border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none glass border border-border text-text-secondary text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primary/50 cursor-pointer hover:text-text-primary transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-surface text-text-primary">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl border border-border p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {GIG_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        category === cat.value
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Price Range (₹)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="input-base !py-2 text-sm"
                  />
                  <span className="text-text-muted">–</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="input-base !py-2 text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-ghost text-sm flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No gigs found</h3>
            <p className="text-text-secondary mb-8">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig, i) => (
              <motion.div
                key={gig._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <GigCard gig={gig} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-text-secondary text-sm">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / 12)}
              className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
