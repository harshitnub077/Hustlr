'use client';

const companies = [
  "Acme Corp", "GlobalTech", "Nexus Systems", "Quantum Data", 
  "Elevate Partners", "Synthetix", "Vector AI", "Pinnacle"
];

export default function TrustSection() {
  return (
    <section className="py-12 border-b border-border bg-[#09090b] relative z-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-8">
        <p className="text-sm font-semibold text-text-muted whitespace-nowrap shrink-0">
          Trusted by innovative engineering teams
        </p>
        
        <div className="relative w-full overflow-hidden flex items-center">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10" />
          
          <div className="flex animate-marquee hover:[animation-play-state:paused] items-center gap-12 w-max">
            {[...companies, ...companies, ...companies].map((company, i) => (
              <div key={`${company}-${i}`} className="text-xl font-bold text-text-secondary/50 uppercase tracking-widest shrink-0">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
