import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultingHeroSection from "@/components/sections/consulting/ConsultingHeroSection";
import ConsultingWhatWeDoSection from "@/components/sections/consulting/ConsultingWhatWeDoSection";
import ConsultingProcessSection from "@/components/sections/consulting/ConsultingProcessSection";
import ConsultingServicesSection from "@/components/sections/consulting/ConsultingServicesSection";
import ConsultingIndustriesSection from "@/components/sections/consulting/ConsultingIndustriesSection";
import ConsultingOutcomesSection from "@/components/sections/consulting/ConsultingOutcomesSection";
import ConsultingDiscoveryCTASection from "@/components/sections/consulting/ConsultingDiscoveryCTASection";

const Consulting = () => {
  return (
    <>
      <Helmet>
        <title>AI Consulting Services | Expert AI Implementation | Conquer365</title>
        <meta
          name="description"
          content="Expert AI consulting to implement solutions that drive measurable results. Strategy, implementation, and optimization for your business. Book a free consultation."
        />
        <meta name="keywords" content="AI consulting, AI implementation, business AI strategy, AI solutions, digital transformation" />
        <link rel="canonical" href="https://conquer365.com/consulting" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <ConsultingHeroSection />
          <ConsultingWhatWeDoSection />
          <ConsultingProcessSection />
          <ConsultingServicesSection />
          <ConsultingIndustriesSection />
          <ConsultingOutcomesSection />
          <ConsultingDiscoveryCTASection />
        </main>
        <Footer />
      </div>

      {/* FacePop Widget */}
      <script
        src="https://cdn.facepop.io/facepop.js"
        data-id="your-facepop-id"
        defer
      />
    </>
  );
};

export default Consulting;
