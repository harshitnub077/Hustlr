'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, ShieldCheck, CreditCard, Box } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Discovery & Selection', desc: 'Browse our directory of elite student profiles. Evaluate portfolios, client verified reviews, and academic backgrounds.' },
  { icon: ShieldCheck, title: 'Verification Protocol', desc: 'Every freelancer is authenticated via university email logic and manual admin ID checks before they can accept enterprise contracts.' },
  { icon: CreditCard, title: 'Secure Escrow Commitment', desc: 'Project funds are held securely in a smart escrow system. Funds are strictly released upon your final milestone approval.' },
  { icon: Box, title: 'Delivery & Handoff', desc: 'Receive high-fidelity deliverables seamlessly through our internal sprint tracking system. Instant chat ensures clear communication.' },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.step-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 bg-[#09090b] relative z-20 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={containerRef}>
        
        <div className="text-center md:max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-border bg-surface-2/50 text-xs font-semibold text-text-secondary mb-6">
            Platform Methodology
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            End-to-End Enterprise Security
          </h2>
          <p className="text-text-secondary text-lg font-medium leading-relaxed">
            Hustlr abstracts the risk of freelance collaboration. From identity verification to escrow payment, our framework guarantees professional deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="step-card card-premium p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-6xl font-black text-surface-2 group-hover:text-border-bright transition-colors duration-500 opacity-20">
                  0{i + 1}
                </div>
                
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-white flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-[#09090b] transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold text-white tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
