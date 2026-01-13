import { WaitlistForm } from "@/components/holly/WaitlistForm";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HollyWaitlistSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="waitlist" className="py-20 bg-background">
      <div
        ref={ref}
        className={`container max-w-2xl text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Be First in Line for{" "}
          <span className="text-gradient-holly">Holly</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join the waitlist to get early access and exclusive founding member pricing
        </p>

        <WaitlistForm variant="hero" />
      </div>
    </section>
  );
};

export default HollyWaitlistSection;
