'use client';

import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#09090b] relative z-20">
      <div className="max-w-[1200px] mx-auto card-premium overflow-hidden relative">
        
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-[100%] blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-6 py-20 md:py-28 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Scale your engineering today.
          </h2>
          <p className="text-lg text-text-secondary font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of forward-thinking enterprises leveraging our elite network of verified student developers, designers, and innovators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/register?role=company" className="btn-primary w-full sm:w-auto text-base h-12 px-8">
              Hire Elite Talent
            </Link>
            <Link href="/register?role=student" className="btn-secondary w-full sm:w-auto text-base h-12 px-8 bg-[#09090b]">
              Apply as Developer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
