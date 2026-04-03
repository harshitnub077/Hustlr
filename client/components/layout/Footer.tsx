import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Gigs', href: '/gigs' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Students: [
    { label: 'Create a Gig', href: '/gigs/create' },
    { label: 'Student Dashboard', href: '/dashboard/student' },
    { label: 'Verification', href: '/verify' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ],
  Company: [
    { label: 'Post a Challenge', href: '/challenges/create' },
    { label: 'Company Dashboard', href: '/dashboard/company' },
    { label: 'Subscribe', href: '/pricing' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">Hustlr</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              The marketplace connecting ambitious college students with companies looking for fresh talent and affordable quality.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass-sm rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-text-primary text-sm mb-4">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Hustlr. All rights reserved.
          </p>
          <p className="text-text-muted text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-danger fill-danger animate-pulse-slow" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
