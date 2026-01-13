import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Wand2, PlayCircle, LayoutGrid } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Using placeholder until images are uploaded
const hollyAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop";

const HollyHeroSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist");
    waitlistSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-hero-holly overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(16,60%,25%)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(30,70%,20%)_0%,_transparent_50%)]" />

      <div className="container relative z-10 py-20 lg:py-32">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(16,85%,58%)]/10 border border-[hsl(16,85%,58%)]/30 rounded-full">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[hsl(16,85%,58%)]">
                Available 24/7
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Meet{" "}
                <span className="text-gradient-holly">Holly</span>, Your AI
                Real Estate Social Media Expert
              </h1>
              <p className="text-lg lg:text-xl text-white/70 max-w-xl">
                Create emotional "one year later" story videos and AI-staged
                images from ordinary listing photos—automatically
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Wand2 className="w-4 h-4 text-[hsl(16,85%,58%)]" />
                <span className="text-sm text-white/80">AI Staging</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <PlayCircle className="w-4 h-4 text-[hsl(16,85%,58%)]" />
                <span className="text-sm text-white/80">Story Videos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <LayoutGrid className="w-4 h-4 text-[hsl(16,85%,58%)]" />
                <span className="text-sm text-white/80">Scroll-Stopping Content</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToWaitlist}
                size="xl"
                className="bg-gradient-to-r from-[hsl(16,85%,58%)] to-[hsl(30,90%,65%)] hover:from-[hsl(16,85%,48%)] hover:to-[hsl(30,90%,55%)] text-white shadow-xl hover:shadow-2xl"
              >
                Try Holly Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="border border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Holly
              </Button>
            </div>
          </div>

          {/* Right Content - Holly Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(16,85%,58%)]/20 to-[hsl(30,90%,65%)]/20 blur-3xl rounded-full scale-110" />

              {/* Holly image */}
              <div className="relative w-[300px] h-[400px] sm:w-[350px] sm:h-[450px] lg:w-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={hollyAvatar}
                  alt="Holly AI - Real Estate Social Media Expert"
                  className="w-full h-full object-cover object-top"
                />

                {/* Stats badge */}
                <div className="absolute bottom-4 right-4 bg-[hsl(16,85%,58%)] text-white px-4 py-3 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold">3x</span>
                  <p className="text-sm opacity-90">More Showings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HollyHeroSection;
