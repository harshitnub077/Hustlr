import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/layout/CustomCursor';
import Preloader from '@/components/layout/Preloader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hustlr | Premium Freelance Network',
  description:
    'Connect with elite, verified university students for enterprise-grade digital solutions.',
  keywords: ['freelance', 'students', 'marketplace', 'gigs', 'hire', 'hustlr', 'premium'],
  authors: [{ name: 'Hustlr' }],
  openGraph: {
    title: 'Hustlr | Premium Freelance Network',
    description: 'Hire verified college students for quality freelance work.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] noise-bg overflow-x-hidden selection:bg-[#fafafa] selection:text-[#09090b]">
        <Preloader />
        <CustomCursor />

        <SmoothScroll>
          <Navbar />
          <main className="page-enter relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
