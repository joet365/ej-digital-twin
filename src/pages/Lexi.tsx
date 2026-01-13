import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LexiHeroSection from "@/components/sections/lexi/LexiHeroSection";
import LexiDemoSection from "@/components/sections/lexi/LexiDemoSection";
import LexiWhatDoesSection from "@/components/sections/lexi/LexiWhatDoesSection";
import LexiHowItWorksSection from "@/components/sections/lexi/LexiHowItWorksSection";
import LexiContentTypesSection from "@/components/sections/lexi/LexiContentTypesSection";
import LexiPlatformsSection from "@/components/sections/lexi/LexiPlatformsSection";
import LexiBenefitsSection from "@/components/sections/lexi/LexiBenefitsSection";
import LexiDiscoveryCTASection from "@/components/sections/lexi/LexiDiscoveryCTASection";
import { useEffect } from "react";

const Lexi = () => {
  useEffect(() => {
    // Load FacePop widget
    const script = document.createElement("script");
    script.src = "https://app.facepop.io/facepop.js";
    script.setAttribute("fp", "RGgzM3VzN2EvODFhNjMwODM=");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[fp="RGgzM3VzN2EvODFhNjMwODM="]');
      if (existingScript) {
        existingScript.remove();
      }
      // Remove FacePop widget if present
      const facepopWidget = document.querySelector(".facepop-container");
      if (facepopWidget) {
        facepopWidget.remove();
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Lexi AI Marketing & Social Manager | Amplify Your Brand | Conquer365</title>
        <meta
          name="description"
          content="Meet Lexi, your AI Marketing & Social Manager. Create engaging content, manage social media, and amplify your brand automatically. Schedule a free discovery call today."
        />
        <meta
          name="keywords"
          content="AI marketing, social media manager, content creation, brand amplification, AI social media"
        />
        <link rel="canonical" href="https://conquer365.com/lexi" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <LexiHeroSection />
          <LexiDemoSection />
          <LexiWhatDoesSection />
          <LexiHowItWorksSection />
          <LexiContentTypesSection />
          <LexiPlatformsSection />
          <LexiBenefitsSection />
          <LexiDiscoveryCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Lexi;
