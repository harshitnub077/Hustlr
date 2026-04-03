'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Shield, CheckCircle, XCircle, Truck,
  AlertTriangle, Package, IndianRupee, Calendar, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, getInitials } from '@/lib/utils';
import ChatBox from '@/components/chat/ChatBox';

const ESCROW_COLORS: Record<string, string> = {
  held: 'text-warning',
  released: 'text-success',
  refunded: 'text-danger',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [showDeliverForm, setShowDeliverForm] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const doAction = async (action: string, body?: object) => {
    setActionLoading(action);
    try {
      const { data } = await api.patch(`/orders/${id}/${action}`, body || {});
      setOrder(data.order);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-12 w-1/2 rounded-xl" />
            <div className="skeleton h-64 rounded-2xl" />
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isBuyer = order.buyerId?._id === user?._id;
  const isSeller = order.sellerId?._id === user?._id;
  const otherParty = isBuyer ? order.sellerId : order.buyerId;
  const statusInfo = ORDER_STATUS_LABELS[order.status];

  const steps = [
    { label: 'Order Placed', icon: Package, done: true },
    { label: 'In Progress', icon: Clock, done: ['in_progress', 'completed'].includes(order.status) },
    { label: 'Delivered', icon: Truck, done: order.status === 'completed' },
    { label: 'Escrow Released', icon: Shield, done: order.escrowStatus === 'released' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link
          href={user?.role === 'company' ? '/dashboard/company' : '/dashboard/student'}
          className="flex items-center gap-2 text-text-secondary hover:text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Order #{id?.toString().slice(-8).toUpperCase()}</h1>
            <p className="text-text-secondary mt-1">{order.gigId?.title}</p>
          </div>
          <span className={`badge text-sm px-4 py-2 ${statusInfo?.color} bg-current/10 border border-current/20`}>
            {statusInfo?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details + Actions + Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            {order.status !== 'cancelled' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border border-border p-6"
              >
                <h2 className="font-semibold text-text-primary mb-5">Order Progress</h2>
                <div className="flex items-center gap-0">
                  {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.done
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-surface-2 border-border text-text-muted'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs font-medium text-center leading-tight ${step.done ? 'text-primary' : 'text-text-muted'}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${step.done ? 'bg-primary' : 'bg-border'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Seller Actions */}
            {isSeller && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-border p-6"
              >
                <h2 className="font-semibold text-text-primary mb-4">Seller Actions</h2>
                <div className="flex flex-wrap gap-3">
                  {order.status === 'pending' && (
                    <button
                      id="accept-order-btn"
                      onClick={() => doAction('accept')}
                      disabled={actionLoading === 'accept'}
                      className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                      {actionLoading === 'accept' ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <CheckCircle className="w-4 h-4" />}
                      Accept Order
                    </button>
                  )}
                  {order.status === 'in_progress' && !showDeliverForm && (
                    <button
                      id="deliver-order-btn"
                      onClick={() => setShowDeliverForm(true)}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Truck className="w-4 h-4" /> Mark as Delivered
                    </button>
                  )}
                  {showDeliverForm && (
                    <div className="w-full space-y-3">
                      <input
                        type="url"
                        value={deliveryUrl}
                        onChange={(e) => setDeliveryUrl(e.target.value)}
                        className="input-base text-sm"
                        placeholder="Delivery URL (Google Drive, GitHub, etc.)"
                      />
                      <textarea
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        className="input-base resize-none text-sm"
                        rows={3}
                        placeholder="Add delivery notes for the buyer..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => doAction('deliver', { deliveryNote, deliveryUrl })}
                          disabled={actionLoading === 'deliver'}
                          className="btn-primary text-sm flex items-center gap-2"
                        >
                          {actionLoading === 'deliver' ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : <CheckCircle className="w-4 h-4" />}
                          Submit Delivery
                        </button>
                        <button onClick={() => setShowDeliverForm(false)} className="btn-ghost text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Buyer Actions */}
            {isBuyer && ['pending', 'in_progress'].includes(order.status) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-border p-6"
              >
                <h2 className="font-semibold text-text-primary mb-4">Buyer Actions</h2>
                <button
                  id="cancel-order-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel? Funds will be refunded.')) {
                      doAction('cancel');
                    }
                  }}
                  disabled={actionLoading === 'cancel'}
                  className="flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger border border-danger/30 rounded-xl text-sm font-medium hover:bg-danger/20 transition-all disabled:opacity-60"
                >
                  {actionLoading === 'cancel' ? (
                    <span className="w-4 h-4 border-2 border-danger/30 border-t-danger rounded-full animate-spin" />
                  ) : <XCircle className="w-4 h-4" />}
                  Cancel Order (Refund)
                </button>
              </motion.div>
            )}

            {/* Delivery */}
            {order.deliveryUrl && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border border-success/30 bg-success/5 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h2 className="font-semibold text-success">Delivery Received</h2>
                </div>
                {order.deliveryNote && (
                  <p className="text-text-secondary text-sm mb-3">{order.deliveryNote}</p>
                )}
                <a
                  href={order.deliveryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm inline-flex items-center gap-2"
                >
                  <Package className="w-4 h-4" /> View Delivery
                </a>
              </motion.div>
            )}

            {/* Chat */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-text-primary">Order Chat</h2>
              </div>
              <ChatBox orderId={id as string} otherParty={otherParty} />
            </motion.div>
          </div>

          {/* Right: Order Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            {/* Amount & Escrow */}
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4">Payment</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Amount</span>
                  <span className="font-bold text-text-primary text-lg">{formatPrice(order.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Escrow</span>
                  <span className={`font-semibold text-sm capitalize ${ESCROW_COLORS[order.escrowStatus]}`}>
                    {order.escrowStatus === 'held' ? '🔒 Held' : order.escrowStatus === 'released' ? '✅ Released' : '↩️ Refunded'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Payment</span>
                  <span className={`text-xs font-medium ${order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/15 flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  Funds are held in escrow until the seller delivers and the work is accepted.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Ordered
                  </span>
                  <span className="text-text-primary">{formatDate(order.createdAt)}</span>
                </div>
                {order.deadline && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Deadline
                    </span>
                    <span className={`font-medium ${new Date(order.deadline) < new Date() && order.status === 'in_progress' ? 'text-danger' : 'text-text-primary'}`}>
                      {formatDate(order.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="text-text-primary">{order.deliveryTimeDays} days</span>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4">Parties</h2>
              {[
                { label: 'Buyer', party: order.buyerId },
                { label: 'Seller', party: order.sellerId },
              ].map(({ label, party }) => (
                <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
                  {party?.profile?.avatarUrl ? (
                    <img src={party.profile.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {getInitials(party?.name || 'U')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-text-primary">{party?.name}</p>
                    <p className="text-xs text-text-muted">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Requirements */}
            {order.requirements && (
              <div className="glass rounded-2xl border border-border p-5">
                <h3 className="text-sm font-semibold text-text-secondary mb-2">Requirements</h3>
                <p className="text-sm text-text-primary leading-relaxed">{order.requirements}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
