import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, PenTool, Share2, MessageCircle, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Brand Analysis",
    description: "Learns your brand voice, style, and target audience",
    icon: Search,
  },
  {
    number: 2,
    title: "Content Creation",
    description: "Generates engaging posts, blogs, and updates",
    icon: PenTool,
  },
  {
    number: 3,
    title: "Multi-Channel Distribution",
    description: "Posts across Facebook, Instagram, LinkedIn, and more",
    icon: Share2,
  },
  {
    number: 4,
    title: "Engagement",
    description: "Responds to comments, messages, and builds community",
    icon: MessageCircle,
  },
  {
    number: 5,
    title: "Analytics",
    description: "Tracks performance and optimizes strategy continuously",
    icon: BarChart3,
  },
];

const LexiHowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How <span className="text-gradient-lexi">Lexi</span> Works
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A proven 5-step process to amplify your marketing
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-orange-500 to-pink-500 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex gap-6 items-start">
                  {/* Number badge */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                        <step.icon className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-white/70 pl-14">{step.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white glow-pink group"
            onClick={() => document.getElementById('discovery-call')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Schedule a Call
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LexiHowItWorksSection;
