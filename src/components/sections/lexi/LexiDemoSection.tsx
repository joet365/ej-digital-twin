import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";

const LexiDemoSection = () => {
  return (
    <section id="lexi-demo" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-pink-950/20">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 text-sm font-medium">See Lexi in Action</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Watch Lexi <span className="text-gradient-lexi">Create Content</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Lexi manages your social media and creates engaging content automatically
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-2xl blur-xl transform scale-105" />
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/50">
              <video
                controls
                className="w-full aspect-video"
                poster="/videos/lexi-poster.jpg"
              >
                <source src="/videos/lexi-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              What You'll See Lexi Do:
            </h3>
            
            {[
              "Create engaging social media posts in seconds",
              "Schedule content across multiple platforms",
              "Analyze and optimize for better engagement",
              "Match your brand voice perfectly",
              "Generate SEO-optimized content",
              "Build consistent brand presence 24/7",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-foreground/80">{feature}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <Button
                size="xl"
                className="bg-pink-500 hover:bg-pink-600 text-white glow-pink group"
                onClick={() => document.getElementById('discovery-call')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Schedule Free Discovery Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LexiDemoSection;
