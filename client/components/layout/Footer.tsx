import Link from 'next/link';
import { ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Talent Directory', href: '/gigs' },
    { label: 'Bounties', href: '/challenges' },
    { label: 'Methodology', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Open Source', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#09090b] pt-24 pb-12 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 text-sm">
          
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-md bg-white text-[#09090b] flex items-center justify-center font-black">H</div>
              ustlr
            </Link>
            <p className="text-text-secondary font-medium max-w-sm leading-relaxed mb-6">
              The premier platform for top-tier university freelancers and enterprise clients.
            </p>
            <div className="flex items-center gap-4 text-text-muted">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-semibold text-white mb-6 tracking-tight">{section}</h4>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-white transition-colors font-medium flex items-center gap-1 group w-max"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted font-medium">
          <p>© {new Date().getFullYear()} Hustlr Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
