import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="relative overflow-hidden glass rounded-3xl border border-primary/30 p-12 md:p-16 text-center gradient-border">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow-gradient pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-text-primary mb-4">
            Ready to Start <span className="gradient-text">Hustling?</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
            Join thousands of students and companies already building the future of work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=student" className="btn-primary flex items-center gap-2 text-base">
              <Zap className="w-4 h-4" /> Start as a Student
            </Link>
            <Link href="/register?role=company" className="btn-secondary flex items-center gap-2 text-base">
              Hire Talent <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
