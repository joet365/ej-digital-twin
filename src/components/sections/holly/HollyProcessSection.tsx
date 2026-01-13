import { Upload, Wand2, Share2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Photos",
    description:
      "Simply upload your MLS listing photos. Holly works with any quality—even smartphone pics.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Holly Creates Magic",
    description:
      "AI-powered staging, lifestyle imagery, and emotional story videos generated in minutes.",
  },
  {
    icon: Share2,
    number: "03",
    title: "Post to Social",
    description:
      "Download your content and post directly to Instagram, TikTok, Facebook, and more.",
  },
];

const HollyProcessSection = () => {
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
            From Listing to{" "}
            <span className="text-gradient-holly">Viral Content</span> in 3 Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Holly handles everything—so you can focus on closing deals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[hsl(16,85%,58%)]/30 to-transparent" />
              )}

              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-[hsl(16,85%,58%)]/30 transition-all duration-300 hover:shadow-lg">
                {/* Step number */}
                <span className="absolute top-4 right-4 text-4xl font-bold text-muted-foreground/20">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(16,85%,58%)] to-[hsl(30,90%,65%)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HollyProcessSection;
