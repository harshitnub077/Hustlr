'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Briefcase, ShoppingBag, Star, IndianRupee, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, GIG_CATEGORIES } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import GigCard from '@/components/gigs/GigCard';

type Tab = 'overview' | 'gigs' | 'orders' | 'earnings';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get('tab') as Tab) || 'overview';

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [gigs, setGigs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'student' && user.role !== 'admin') { router.push('/'); return; }

    Promise.all([
      api.get('/gigs/seller/' + user._id),
      api.get('/orders?role=seller'),
    ])
      .then(([gigsRes, ordersRes]) => {
        setGigs(gigsRes.data.gigs || []);
        setOrders(ordersRes.data.orders || []);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalEarnings = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'gigs', label: 'My Gigs', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
  ];

  const stats = [
    { label: 'Active Gigs', value: gigs.length, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Completed', value: orders.filter((o) => o.status === 'completed').length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Earnings', value: formatPrice(totalEarnings), icon: IndianRupee, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Welcome back, <span className="gradient-text">{user?.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-text-secondary mt-1">
              {user?.isApprovedByAdmin
                ? 'Your account is verified and active'
                : '⚠️ Your account is pending admin verification'}
            </p>
          </div>
          <Link href="/gigs/create" className="btn-primary flex items-center gap-2 hidden sm:flex">
            <Plus className="w-4 h-4" /> New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl border border-border p-5"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-text-primary font-display">{stat.value}</p>
                <p className="text-text-secondary text-xs mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl border border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="glass rounded-2xl border border-border p-6">
                <h2 className="font-semibold text-text-primary mb-4">Recent Orders</h2>
                {orders.slice(0, 4).length === 0 ? (
                  <p className="text-text-muted text-sm">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => {
                      const statusInfo = ORDER_STATUS_LABELS[order.status];
                      return (
                        <div key={order._id} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{order.gigId?.title}</p>
                            <p className="text-xs text-text-muted">by {order.buyerId?.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-text-primary">{formatPrice(order.price)}</p>
                            <p className={`text-xs ${statusInfo?.color}`}>{statusInfo?.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Gigs preview */}
              <div className="glass rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-text-primary">Active Gigs</h2>
                  <Link href="/gigs/create" className="text-xs text-primary hover:text-primary-light flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add New
                  </Link>
                </div>
                {gigs.slice(0, 3).length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-text-muted text-sm mb-3">No gigs yet</p>
                    <Link href="/gigs/create" className="btn-primary text-sm !py-2">Create First Gig</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gigs.slice(0, 3).map((gig) => {
                      const cat = GIG_CATEGORIES.find((c) => c.value === gig.category);
                      return (
                        <Link key={gig._id} href={`/gigs/${gig._id}`} className="flex items-center gap-3 p-3 bg-surface rounded-xl hover:bg-surface-2 transition-colors">
                          <span className="text-2xl">{cat?.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{gig.title}</p>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <Star className="w-3 h-3 fill-warning text-warning" />
                              <span>{gig.averageRating || 'New'}</span>
                              <span>·</span>
                              <span>{gig.totalOrders} orders</span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-text-primary flex-shrink-0">{formatPrice(gig.price)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gigs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary">{gigs.length} gig{gigs.length !== 1 ? 's' : ''}</p>
                <Link href="/gigs/create" className="btn-primary flex items-center gap-2 text-sm !py-2.5">
                  <Plus className="w-4 h-4" /> Create Gig
                </Link>
              </div>
              {gigs.length === 0 ? (
                <div className="text-center py-24 glass rounded-2xl border border-border">
                  <p className="text-5xl mb-4">🚀</p>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Create your first gig</h3>
                  <p className="text-text-secondary mb-6">Showcase your skills and start earning</p>
                  <Link href="/gigs/create" className="btn-primary">Get Started</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gigs.map((gig) => <GigCard key={gig._id} gig={{ ...gig, sellerId: user }} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="glass rounded-2xl border border-border overflow-hidden">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="text-text-secondary">No orders yet</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Gig</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Buyer</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Amount</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Status</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => {
                      const statusInfo = ORDER_STATUS_LABELS[order.status];
                      return (
                        <tr key={order._id} className="hover:bg-surface transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-text-primary truncate max-w-[200px]">{order.gigId?.title}</p>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">{order.buyerId?.name}</td>
                          <td className="px-6 py-4 font-semibold text-text-primary">{formatPrice(order.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`badge ${statusInfo?.color} bg-current/10 border border-current/20`}>
                              {statusInfo?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-muted">{formatDate(order.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass rounded-2xl border border-border p-6 text-center">
                <IndianRupee className="w-8 h-8 text-success mx-auto mb-3" />
                <p className="text-3xl font-bold text-text-primary font-display">{formatPrice(totalEarnings)}</p>
                <p className="text-text-secondary text-sm mt-1">Total Earned</p>
              </div>
              <div className="glass rounded-2xl border border-border p-6 text-center">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-text-primary font-display">
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
                <p className="text-text-secondary text-sm mt-1">Completed Orders</p>
              </div>
              <div className="glass rounded-2xl border border-border p-6 text-center">
                <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
                <p className="text-3xl font-bold text-text-primary font-display">
                  {orders.filter((o) => o.status === 'in_progress').length}
                </p>
                <p className="text-text-secondary text-sm mt-1">In Progress</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
