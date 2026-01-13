import { FileText, Brain, Rocket, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Tell Us About Your Business",
      description: "Answer a few simple questions about how you want calls handled.",
      time: "5 minutes",
    },
    {
      number: "02",
      icon: Brain,
      title: "Kate Learns Your Business",
      description: "We train Kate on your services, pricing, and scheduling preferences.",
      time: "24 hours",
    },
    {
      number: "03",
      icon: Rocket,
      title: "Go Live",
      description: "Start receiving calls through Kate. Monitor everything in real-time.",
      time: "Instant",
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground">
            From signup to live calls in less than 48 hours
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line (desktop only) */}
          <motion.div 
            className="hidden lg:block absolute top-32 left-[20%] right-[20%] h-0.5"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              background: "linear-gradient(90deg, hsl(var(--border)) 0%, hsl(var(--accent)) 50%, hsl(var(--border)) 100%)",
            }}
          />

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <motion.div 
                  className="group bg-card border border-border rounded-2xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:border-accent/30"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Step number with gradient background */}
                    <motion.div 
                      className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)",
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
                    >
                      <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div 
                      className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.15 }}
                    >
                      <step.icon className="w-7 h-7 text-accent" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>

                    {/* Time badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-semibold">
                      <span>{step.time}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow between steps (desktop) */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden lg:flex absolute top-32 -right-4 w-8 h-8 bg-accent text-primary-foreground rounded-full items-center justify-center z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.2, type: "spring" }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}

                {/* Arrow (mobile only) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6 lg:hidden">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <ArrowRight className="w-6 h-6 text-accent rotate-90" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            variant="success" 
            size="xl" 
            className="group glow-success hover:scale-105 transition-all duration-300"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
