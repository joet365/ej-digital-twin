import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ClipboardCheck, Map, Wrench, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description: "Understand your business goals, challenges, and AI readiness (30 minutes, free)",
    icon: Phone,
  },
  {
    number: "02",
    title: "AI Readiness Assessment",
    description: "Evaluate your current systems, data, and infrastructure",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Strategy Development",
    description: "Create custom AI implementation roadmap with prioritized use cases",
    icon: Map,
  },
  {
    number: "04",
    title: "Implementation Support",
    description: "Hands-on guidance for deploying AI solutions and training your team",
    icon: Wrench,
  },
  {
    number: "05",
    title: "Ongoing Optimization",
    description: "Continuous improvement, monitoring, and scaling of AI initiatives",
    icon: TrendingUp,
  },
];

const ConsultingProcessSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="consulting-process" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Consulting Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven 5-step methodology to transform your business with AI
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative mb-8 last:mb-0"
            >
              <div className="flex gap-6 items-start">
                {/* Number badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                >
                  {step.number}
                </motion.div>

                {/* Content card */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-5 h-5 text-purple-500" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white group"
            onClick={() => scrollToSection('discovery-cta')}
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultingProcessSection;
