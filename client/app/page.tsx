import HeroSection from '@/components/home/HeroSection';
import FeaturedGigs from '@/components/home/FeaturedGigs';
import CategoryGrid from '@/components/home/CategoryGrid';
import HowItWorks from '@/components/home/HowItWorks';
import StatsBar from '@/components/home/StatsBar';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoryGrid />
      <FeaturedGigs />
      <HowItWorks />
      <CTABanner />
    </>
  );
}
