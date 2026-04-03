'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, ShoppingBag, Trophy, Users, Eye, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'orders' | 'challenges';

export default function CompanyDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'company' && user.role !== 'admin') { router.push('/'); return; }

    Promise.all([
      api.get('/orders?role=buyer'),
      api.get(`/challenges?status=open&limit=5`),
    ])
      .then(([ordersRes, challengesRes]) => {
        setOrders(ordersRes.data.orders || []);
        setChallenges(challengesRes.data.challenges || []);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const stats = [
    { label: 'Active Hires', value: orders.filter((o) => o.status === 'in_progress').length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Completed', value: orders.filter((o) => o.status === 'completed').length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Challenges', value: challenges.length, icon: Trophy, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
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
              Company Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              {user?.companyDetails?.companyName || user?.name}
            </p>
          </div>
          <div className="hidden sm:flex gap-3">
            <Link href="/gigs" className="btn-secondary flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4" /> Browse Gigs
            </Link>
            <Link href="/challenges/create" className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Post Challenge
            </Link>
          </div>
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl border border-border p-6">
                <h2 className="font-semibold text-text-primary mb-4">Recent Orders</h2>
                {orders.slice(0, 4).length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-text-muted text-sm mb-3">No orders yet</p>
                    <Link href="/gigs" className="btn-primary text-sm !py-2">Browse Gigs</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => {
                      const statusInfo = ORDER_STATUS_LABELS[order.status];
                      return (
                        <div key={order._id} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{order.gigId?.title}</p>
                            <p className="text-xs text-text-muted">by {order.sellerId?.name}</p>
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

              <div className="glass rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-text-primary">Your Challenges</h2>
                  <Link href="/challenges/create" className="text-xs text-primary hover:text-primary-light flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </Link>
                </div>
                {challenges.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-text-muted text-sm mb-3">No challenges posted</p>
                    <Link href="/challenges/create" className="btn-primary text-sm !py-2">Post a Challenge</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {challenges.slice(0, 3).map((ch) => (
                      <div key={ch._id} className="p-3 bg-surface rounded-xl">
                        <p className="text-sm font-medium text-text-primary">{ch.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                          <span className="text-success font-semibold">{formatPrice(ch.reward)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(ch.deadline)}
                          </span>
                          <span>·</span>
                          <span>{ch.submissions?.length || 0} submissions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="glass rounded-2xl border border-border overflow-hidden">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-text-secondary mb-4">No orders yet</p>
                  <Link href="/gigs" className="btn-primary">Browse Gigs</Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Service</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Seller</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Amount</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Status</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Escrow</th>
                      <th className="text-left px-6 py-4 text-text-secondary font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => {
                      const statusInfo = ORDER_STATUS_LABELS[order.status];
                      return (
                        <tr key={order._id} className="hover:bg-surface transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-text-primary truncate max-w-[180px]">{order.gigId?.title}</p>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">{order.sellerId?.name}</td>
                          <td className="px-6 py-4 font-semibold text-text-primary">{formatPrice(order.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`badge text-xs border border-current/20`} style={{ color: statusInfo?.color?.replace('text-', '') }}>
                              {statusInfo?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium ${
                              order.escrowStatus === 'held' ? 'text-warning' :
                              order.escrowStatus === 'released' ? 'text-success' : 'text-danger'
                            }`}>{order.escrowStatus}</span>
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

          {activeTab === 'challenges' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary">Post bounty challenges for students</p>
                <Link href="/challenges/create" className="btn-primary flex items-center gap-2 text-sm !py-2.5">
                  <Plus className="w-4 h-4" /> Post Challenge
                </Link>
              </div>
              <Link href="/challenges" className="btn-secondary text-sm">
                Browse all challenges
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
