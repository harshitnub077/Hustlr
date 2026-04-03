'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, Building2, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type Role = 'student' | 'company';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as Role) || 'student';

  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        name,
        email,
        password,
        role,
        ...(role === 'student' ? { collegeDetails: { collegeName, eduEmail: email } } : {}),
        ...(role === 'company' ? { companyDetails: { companyName } } : {}),
      });
      router.push(role === 'student' ? '/dashboard/student' : '/dashboard/company');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">Hustlr</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-text-primary">Create account</h1>
          <p className="text-text-secondary mt-2">Join the student freelance revolution</p>
        </div>

        <div className="glass rounded-3xl border border-border p-8 shadow-card">
          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-surface rounded-xl">
            {(['student', 'company'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === r
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {r === 'student' ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {r === 'student' ? 'Student' : 'Company'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base pl-10"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Role-specific fields */}
            <AnimatePresence mode="wait">
              {role === 'student' ? (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">College / University</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="reg-college"
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="input-base pl-10"
                      placeholder="e.g. IIT Bombay"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="company"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="reg-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input-base pl-10"
                      placeholder="Your company name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {role === 'student' ? 'College / Personal Email' : 'Work Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="you@college.edu"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-10 pr-12"
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
