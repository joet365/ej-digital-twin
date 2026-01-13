import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JoeHeroSection from "@/components/sections/joe/JoeHeroSection";
import JoeDemoSection from "@/components/sections/joe/JoeDemoSection";
import JoeWhatDoesSection from "@/components/sections/joe/JoeWhatDoesSection";
import JoeHowItWorksSection from "@/components/sections/joe/JoeHowItWorksSection";
import JoeUseCasesSection from "@/components/sections/joe/JoeUseCasesSection";
import JoeBenefitsSection from "@/components/sections/joe/JoeBenefitsSection";
import JoeDiscoveryCTASection from "@/components/sections/joe/JoeDiscoveryCTASection";
import { useEffect } from "react";

const Joe = () => {
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
        <title>Joe AI Operations Specialist | Automate Your Business | Conquer365</title>
        <meta
          name="description"
          content="Meet Joe, your AI Operations Specialist. Streamline workflows, automate processes, and scale your operations 24/7. Schedule a free discovery call today."
        />
        <meta
          name="keywords"
          content="AI operations, workflow automation, business automation, process optimization, AI specialist"
        />
        <link rel="canonical" href="https://conquer365.com/joe" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <JoeHeroSection />
          <JoeDemoSection />
          <JoeWhatDoesSection />
          <JoeHowItWorksSection />
          <JoeUseCasesSection />
          <JoeBenefitsSection />
          <JoeDiscoveryCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Joe;
