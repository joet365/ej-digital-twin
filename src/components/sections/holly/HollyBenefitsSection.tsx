import {
  Sparkles,
  Clock,
  TrendingUp,
  DollarSign,
  Smartphone,
  Users,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Using placeholder until image is uploaded
const hollyAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Staging",
    description:
      "Transform empty rooms into beautifully furnished spaces that help buyers envision living there.",
  },
  {
    icon: Clock,
    title: "Save 10+ Hours/Week",
    description:
      "No more hiring photographers or waiting for staging. Get content in minutes, not days.",
  },
  {
    icon: TrendingUp,
    title: "3x More Engagement",
    description:
      "Lifestyle content gets 3x more engagement than standard listing photos on social media.",
  },
  {
    icon: DollarSign,
    title: "Increase Listing Value",
    description:
      "Staged homes sell for 6-10% more on average. Holly makes staging accessible for every listing.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "Upload from your phone, tablet, or computer. Holly is always ready when you are.",
  },
  {
    icon: Users,
    title: "Build Your Brand",
    description:
      "Consistent, high-quality content helps you stand out and attract more clients.",
  },
];

const HollyBenefitsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Agents Love <span className="text-gradient-holly">Holly</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create scroll-stopping real estate content
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-card border border-border rounded-2xl p-6 hover:border-[hsl(16,85%,58%)]/30 transition-all duration-300 hover:shadow-lg ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(16,85%,58%)]/10 to-[hsl(30,90%,65%)]/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-[hsl(16,85%,58%)]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {benefit.description}
              </p>
            </div>
          ))}

          {/* Meet Holly Card */}
          <div
            className={`md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[hsl(16,60%,15%)] to-[hsl(30,70%,20%)] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[hsl(16,85%,58%)]/30 flex-shrink-0">
              <img
                src={hollyAvatar}
                alt="Holly AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">
                Meet Holly, Your 24/7 Content Partner
              </h3>
              <p className="text-white/70">
                Holly never sleeps, never takes breaks, and always delivers stunning content. 
                She's the AI teammate every real estate agent needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HollyBenefitsSection;
