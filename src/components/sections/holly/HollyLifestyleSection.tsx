import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Using placeholders until images are uploaded
const backyardBefore = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop";
const backyardAfter = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop";

const benefits = [
  "Transform empty backyards into dream entertaining spaces",
  "Show buyers the lifestyle potential of every listing",
  "Create emotional connections that drive faster sales",
  "Stand out in crowded MLS listings",
];

const HollyLifestyleSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Before */}
              <div className="space-y-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={backyardBefore}
                    alt="Before - Empty backyard"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Before
                </p>
              </div>

              {/* After */}
              <div className="space-y-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-2 ring-[hsl(16,85%,58%)]/30">
                  <img
                    src={backyardAfter}
                    alt="After - Staged backyard with patio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-[hsl(16,85%,58%)] text-center font-medium">
                  After Holly
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Show Buyers the{" "}
              <span className="text-gradient-holly">Lifestyle</span>, Not Just
              the Listing
            </h2>
            <p className="text-lg text-muted-foreground">
              Holly transforms ordinary listing photos into aspirational lifestyle
              content that helps buyers envision their future in the home.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(16,85%,58%)]/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-[hsl(16,85%,58%)]" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HollyLifestyleSection;
