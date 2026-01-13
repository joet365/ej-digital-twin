import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, Link, Rocket, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Assessment",
    description: "Analyzes your current operations and identifies bottlenecks",
    icon: Search,
  },
  {
    number: 2,
    title: "Strategy",
    description: "Designs custom automation workflows tailored to your needs",
    icon: Lightbulb,
  },
  {
    number: 3,
    title: "Integration",
    description: "Connects seamlessly with your existing tools and systems",
    icon: Link,
  },
  {
    number: 4,
    title: "Deployment",
    description: "Implements AI automation across your operations",
    icon: Rocket,
  },
  {
    number: 5,
    title: "Optimization",
    description: "Continuously monitors and improves performance",
    icon: TrendingUp,
  },
];

const JoeHowItWorksSection = () => {
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
            How <span className="text-gradient-joe">Joe</span> Works
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A proven 5-step process to transform your operations
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-blue-500 to-teal-500 hidden md:block" />

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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-teal-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                        <step.icon className="w-5 h-5 text-teal-400" />
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
            className="bg-teal-500 hover:bg-teal-600 text-white glow-teal group"
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

export default JoeHowItWorksSection;
