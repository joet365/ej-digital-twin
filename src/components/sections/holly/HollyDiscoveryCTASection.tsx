import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/holly/WaitlistForm";
import { HollyAvatar } from "@/components/holly/HollyAvatar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Using placeholder until image is uploaded
const hollyAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop";

const HollyDiscoveryCTASection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-32 gradient-cta-holly">
      <div className="container">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <HollyAvatar
            size="xl"
            imageSrc={hollyAvatar}
            showSpeechBubble
            speechText="Ready to transform your listings? Let's create some magic together!"
            speechPosition="bottom"
            className="justify-center mb-8"
          />

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 mt-16">
            Ready to Stand Out on Social Media?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Join the waitlist today and be among the first agents to experience
            Holly's AI-powered listing transformation.
          </p>

          <div className="max-w-md mx-auto">
            <WaitlistForm variant="footer" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HollyDiscoveryCTASection;
