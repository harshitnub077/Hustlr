import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <div className="relative text-center">
        {/* Glitchy 404 */}
        <div className="relative mb-8 inline-block">
          <p className="font-display text-[10rem] font-black leading-none select-none">
            <span className="gradient-text">4</span>
            <span className="text-border">0</span>
            <span className="gradient-text">4</span>
          </p>
          <div className="absolute inset-0 blur-3xl opacity-20 font-display text-[10rem] font-black leading-none text-primary pointer-events-none">
            404
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary max-w-sm mx-auto mb-10 leading-relaxed">
          Looks like this page doesn't exist. It may have been moved, deleted, or you followed a broken link.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/gigs" className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Browse Gigs
          </Link>
        </div>
      </div>
    </div>
  );
}
