'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Message {
  _id: string;
  sender: { _id: string; name: string; profile: { avatarUrl?: string } };
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  orderId: string;
  otherParty: { _id: string; name: string; profile?: { avatarUrl?: string } };
}

let socketInstance: Socket | null = null;

export default function ChatBox({ orderId, otherParty }: ChatBoxProps) {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch initial messages
  useEffect(() => {
    api
      .get(`/messages/${orderId}`)
      .then((res) => setMessages(res.data.messages || []))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Socket.io connection
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      socketInstance?.emit('join_order', orderId);
    });

    socketInstance.on('disconnect', () => setConnected(false));

    socketInstance.on('new_message', (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
    };
  }, [orderId, token]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || sending || !user) return;
    setSending(true);
    setInput('');

    try {
      if (socketInstance?.connected) {
        // Send via socket (real-time)
        socketInstance.emit('send_message', {
          orderId,
          senderId: user._id,
          content,
        });
      } else {
        // Fallback: HTTP
        const { data } = await api.post(`/messages/${orderId}`, { content });
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {
      setInput(content); // restore on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOwn = (msg: Message) => msg.sender._id === user?._id;

  return (
    <div className="flex flex-col h-full min-h-[500px] glass rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/50">
        <div className="flex items-center gap-3">
          {otherParty?.profile?.avatarUrl ? (
            <img
              src={otherParty.profile.avatarUrl}
              alt={otherParty.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
              {getInitials(otherParty?.name || 'U')}
            </div>
          )}
          <div>
            <p className="font-semibold text-text-primary text-sm">{otherParty?.name}</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-text-muted'}`} />
              <span className="text-xs text-text-muted">{connected ? 'Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💬
            </div>
            <p className="text-text-secondary font-medium">No messages yet</p>
            <p className="text-text-muted text-sm mt-1">Start the conversation below</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const own = isOwn(msg);
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${own ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {!own && (
                      msg.sender?.profile?.avatarUrl ? (
                        <img src={msg.sender.profile.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                          {getInitials(msg.sender?.name || 'U')}
                        </div>
                      )
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[70%] ${own ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          own
                            ? 'bg-primary text-white rounded-br-sm shadow-glow-sm'
                            : 'bg-surface-2 text-text-primary border border-border rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-text-muted px-1">
                        {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-surface/30">
        <div className="flex items-center gap-2 glass-sm rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-all">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm outline-none"
            disabled={!connected}
            maxLength={2000}
          />
          <button
            id="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || sending || !connected}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              input.trim() && connected
                ? 'bg-primary text-white hover:bg-primary-hover shadow-glow-sm'
                : 'bg-surface-3 text-text-muted cursor-not-allowed'
            }`}
          >
            {sending ? (
              <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        {!connected && (
          <p className="text-xs text-text-muted mt-1.5 text-center">
            Reconnecting to real-time chat...
          </p>
        )}
      </div>
    </div>
  );
}
