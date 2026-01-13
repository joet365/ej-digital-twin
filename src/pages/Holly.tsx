import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HollyHeroSection from "@/components/sections/holly/HollyHeroSection";
import HollyWaitlistSection from "@/components/sections/holly/HollyWaitlistSection";
import HollyLifestyleSection from "@/components/sections/holly/HollyLifestyleSection";
import HollyProcessSection from "@/components/sections/holly/HollyProcessSection";
import HollyVideoSection from "@/components/sections/holly/HollyVideoSection";
import HollyBeforeAfterSection from "@/components/sections/holly/HollyBeforeAfterSection";
import HollyHowItWorksSection from "@/components/sections/holly/HollyHowItWorksSection";
import HollyBenefitsSection from "@/components/sections/holly/HollyBenefitsSection";
import HollyFAQSection from "@/components/sections/holly/HollyFAQSection";
import HollyDiscoveryCTASection from "@/components/sections/holly/HollyDiscoveryCTASection";

const Holly = () => {
  return (
    <>
      <Helmet>
        <title>Holly - AI Real Estate Social Media Expert | Conquer365</title>
        <meta
          name="description"
          content="Meet Holly, your AI real estate social media expert. Create emotional 'one year later' story videos and AI-staged images from ordinary listing photos automatically."
        />
      </Helmet>

      <Navbar />
      <main className="min-h-screen">
        <HollyHeroSection />
        <HollyWaitlistSection />
        <HollyLifestyleSection />
        <HollyProcessSection />
        <HollyVideoSection />
        <HollyBeforeAfterSection />
        <HollyHowItWorksSection />
        <HollyBenefitsSection />
        <HollyFAQSection />
        <HollyDiscoveryCTASection />
      </main>
      <Footer />
    </>
  );
};

export default Holly;
