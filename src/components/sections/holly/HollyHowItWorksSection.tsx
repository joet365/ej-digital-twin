import { Camera, Wand2, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: Camera,
    step: "Step 1",
    title: "Upload Listing Photos",
    description:
      "Drop in your MLS photos—Holly accepts any format, any quality. Even smartphone pics work great.",
  },
  {
    icon: Wand2,
    step: "Step 2",
    title: "AI Creates Content",
    description:
      "Holly generates staged images, lifestyle scenes, and emotional story videos in under 2 minutes.",
  },
  {
    icon: TrendingUp,
    step: "Step 3",
    title: "Post & Get Results",
    description:
      "Share to your social channels and watch engagement soar. Track performance right in the dashboard.",
  },
];

const HollyHowItWorksSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How <span className="text-gradient-holly">Holly</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your listings into viral social content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className={`relative text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-[hsl(16,85%,58%)]/30" />
              )}

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(16,85%,58%)]/10 to-[hsl(30,90%,65%)]/10 border-2 border-[hsl(16,85%,58%)]/30 mb-6">
                <item.icon className="w-10 h-10 text-[hsl(16,85%,58%)]" />
              </div>

              {/* Step label */}
              <p className="text-sm font-semibold text-[hsl(16,85%,58%)] mb-2">
                {item.step}
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HollyHowItWorksSection;
