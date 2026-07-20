import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatisticsSection from "@/components/landing/StatisticsSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BlogsSection from "@/components/landing/BlogsSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import AiSection from "@/components/landing/AiSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <StatisticsSection />
      <CategoriesSection />
      <AiSection />
      <TestimonialsSection />
      <BlogsSection />
      <NewsletterSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
