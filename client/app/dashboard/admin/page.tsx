'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Shield, BarChart3, CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatDate, getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Tab = 'users' | 'pending' | 'stats';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [users, setUsers] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes, statsRes] = await Promise.all([
        api.get('/users?limit=50'),
        api.get('/users?role=student&isApprovedByAdmin=false&limit=20'),
        api.get('/orders/stats'),
      ]);
      setUsers(allRes.data.users || []);
      setPendingUsers(pendingRes.data.users || []);
      setStats(statsRes.data.stats || []);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    await api.patch(`/users/${userId}/approve`);
    setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleSuspend = async (userId: string) => {
    await api.patch(`/users/${userId}/suspend`);
    fetchData();
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'pending', label: `Pending (${pendingUsers.length})`, icon: UserCheck },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'stats', label: 'Order Stats', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="skeleton h-10 w-64 rounded-xl mb-8" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-danger" />
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          </div>
          <p className="text-text-secondary">
            Manage users, verify students, and monitor platform activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, color: 'text-primary', bg: 'bg-primary/10', icon: Users },
            { label: 'Students', value: users.filter((u) => u.role === 'student').length, color: 'text-accent', bg: 'bg-accent/10', icon: UserCheck },
            { label: 'Companies', value: users.filter((u) => u.role === 'company').length, color: 'text-success', bg: 'bg-success/10', icon: UserCheck },
            { label: 'Pending Approval', value: pendingUsers.length, color: 'text-warning', bg: 'bg-warning/10', icon: Eye },
          ].map((stat, i) => {
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
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="glass rounded-2xl border border-border text-center py-16">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-text-primary">All caught up!</h3>
                  <p className="text-text-secondary mt-1">No pending student verifications</p>
                </div>
              ) : (
                pendingUsers.map((u) => (
                  <div key={u._id} className="glass rounded-2xl border border-border p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-semibold text-text-primary">{u.name}</h3>
                        <span className="badge bg-warning/10 text-warning border border-warning/20 text-xs">Pending</span>
                      </div>
                      <p className="text-sm text-text-secondary">{u.email}</p>
                      {u.collegeDetails?.collegeName && (
                        <p className="text-xs text-text-muted mt-0.5">
                          🎓 {u.collegeDetails.collegeName}
                        </p>
                      )}
                      <p className="text-xs text-text-muted mt-0.5">Registered: {formatDate(u.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        id={`approve-${u._id}`}
                        onClick={() => handleApprove(u._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-success/10 text-success border border-success/30 rounded-xl text-sm font-medium hover:bg-success/20 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        id={`reject-${u._id}`}
                        onClick={() => handleSuspend(u._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-xl text-sm font-medium hover:bg-danger/20 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">User</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Role</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Joined</th>
                    <th className="text-left px-6 py-4 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-text-primary">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge text-xs ${
                          u.role === 'admin' ? 'bg-danger/10 text-danger border-danger/20' :
                          u.role === 'company' ? 'bg-accent/10 text-accent border-accent/20' :
                          'bg-primary/10 text-primary border-primary/20'
                        } border`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${u.isApprovedByAdmin ? 'text-success' : 'text-warning'}`}>
                          {u.isApprovedByAdmin ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-muted">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!u.isApprovedByAdmin && u.role === 'student' && (
                            <button onClick={() => handleApprove(u._id)} className="text-xs text-success hover:underline">Approve</button>
                          )}
                          {u.role !== 'admin' && u.isApprovedByAdmin && (
                            <button onClick={() => handleSuspend(u._id)} className="text-xs text-danger hover:underline">Suspend</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((s: any) => (
                <div key={s._id} className="glass rounded-2xl border border-border p-6 text-center">
                  <p className="text-3xl font-bold text-text-primary font-display">{s.count}</p>
                  <p className="text-text-secondary capitalize mt-1">{s._id?.replace('_', ' ')} Orders</p>
                  <p className="text-success font-semibold mt-2 text-sm">
                    Revenue: ₹{s.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
